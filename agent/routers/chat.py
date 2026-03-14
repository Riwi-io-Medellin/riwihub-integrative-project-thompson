from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.aiService import (
    chat_with_context, generate_summary, get_welcome_message
)
from services.companyService import research_company_and_suggest
from database import get_projects_filtered

router  = APIRouter(prefix="/api", tags=["Agent"])

# Models request

class InitRequest (BaseModel):
    role: str
    company_name: Optional[str] = None
    language: str = "es"

class ChatRequest (BaseModel):
    message: str
    history: List[dict] = []
    role: str = "client"
    company_name: Optional[str] = None
    company_profile: Optional[str] = None
    language: str = "auto"

class FilterRequest (BaseModel):
    search_term: Optional[str] = None
    nicho: Optional[str] = None
    tecnologia: Optional[str] = None
    ruta: Optional[str] = None
    cohorte: Optional[str] = None
    calificacion_min: Optional[float] = None

class SummaryRequest (BaseModel):
    project: dict
    language: str = "es"


# Endpoints

@router.post("/chat/init")
async def chat_init(req: InitRequest):
    """Genera bienvenida según rol. Si es cliente con empresa, investiga y sugiere."""
    lang = req.language if req.language in ["es", "en"] else "es"
    welcome = await get_welcome_message(req.role, lang, req.company_name)
    profile = None

    if req.role == "client" and req.company_name:
        all_projects = await get_projects_filtered()
        result = await research_company_and_suggest(req.company_name, all_projects, lang)
        profile = result["profile"]
        sep = "\n\n\n"
        header = (f"Basándonos en lo que hace tu compañia **{req.company_name}**, tenemos proyectos que podrían interesarte."
            if lang == "es"
            else f"Based on what **{req.company_name}** does, we have projects that might interest you.")
        #calltoaction
        cta = ("¿Te gustaría que te muestre los más relevantes, o prefieres explorar por otra área?"
            if lang == "es"
            else "Would you like to see the most relevant ones, or explore another area?")
        welcome += f"{sep}{header} {cta}"

    return {"welcome_message": welcome, "company_profile": profile}

@router.post("/chat")
async def chat(req: ChatRequest):
    """Chat principal con contexto de rol, empresa e historial."""
    return await chat_with_context(
        req.message, req.history,
        req.role, req.company_name,
        req.company_profile, req.language
    )

@router.post("/projects/filter")
async def filter_projects(req: FilterRequest):
    """Filtrado directo de proyectos para el grid (sin IA)."""
    projects = await get_projects_filtered(
        req.search_term, req.nicho, req.tecnologia,
        req.ruta, req.cohorte, req.calificacion_min
    )
    return {"projects": projects, "count": len(projects)}

@router.post("/projects/summary")
async def project_summary(req: SummaryRequest):
    """Resumen IA no técnico de un proyecto específico."""
    text = await generate_summary(req.project, req.language)
    return {"summary": text}