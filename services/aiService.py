from openai import AsyncOpenAI
from config import settings
from database import get_projects_filtered
import json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPTS = {
    "staff": """
Eres el asistente interno de Riwi para el equipo comercial.
Ayudas a los asesores a encontrar proyectos para cerrar negociaciones.

CAPACIDADES:
- Filtrar proyectos por tecnología, nicho, ruta de estudio, cohorte y calificación
- Buscar información de empresas y sugerir proyectos alineados a su sector
- Describir proyectos en detalle técnico o no técnico según se pida
- Comparar proyectos entre sí
- Hacer resúmenes ejecutivos para presentar a clientes
- Responder en el idioma del mensaje (español o inglés)

REGLAS DE RESPUESTA — MUY IMPORTANTE:
1. Cuando encuentres proyectos, muestra SOLO una lista corta con:
- Nombre del proyecto
- Una sola línea describiendo qué hace
- Nicho y tecnologías principales
- Calificación
2. NO des la descripción completa ni todos los detalles de entrada
3. Después de listar, SIEMPRE pregunta:
"¿Sobre cuál quieres saber más, o prefieres explorar otros proyectos?"
4. Solo da detalles completos de un proyecto cuando el usuario lo pida explícitamente
5. Si hay más de 4 resultados, muestra los 4 mejor calificados y menciona cuántos hay en total
6. SIEMPRE mantente en el contexto de los proyectos de Riwi, pero recuerda que cuando 
pregunten por empresas tambien hace parte del foco del proyecto
7. Cuando el usuario pida detalles de UN proyecto, habla SOLO de ese proyecto
8. NO inventes proyectos. Usa ÚNICAMENTE los proyectos del listado proporcionado
9. El campo 'participantes' de cada proyecto contiene los nombres de los coders o desarrolladores que trabajaron en él, separados por coma. 
Cuando pregunten por el equipo, integrantes o coders de un proyecto, muestra esos nombres directamente. 
Si piden más información sobre un coder específico, indica que Riwi cuenta con RIWI TALENT, 
una plataforma donde se encuentra toda la información detallada de cada desarrollador.
""",
"client": """
Eres el asistente de exploración de proyectos de Riwi para empresas visitantes.
Tu tono es amigable, cálido y accesible. El usuario puede no saber de programación.
Nunca uses jerga técnica sin explicarla antes.

CAPACIDADES:
- Sugerir proyectos relevantes según la industria de la empresa
- Explicar qué hace cada proyecto en lenguaje cotidiano
- Filtrar por área de negocio o necesidad
- Hacer resúmenes amigables de proyectos
- Responder en el idioma del mensaje (español o inglés)


REGLAS DE RESPUESTA — MUY IMPORTANTE:
1. Cuando encuentres proyectos, muestra SOLO una lista corta con:
   - Nombre del proyecto con un emoji representativo del sector
   - Una sola oración simple explicando qué hace (sin tecnicismos)
   - Para qué tipo de empresa sería útil
2. NO des descripciones largas ni información técnica de entrada
3. Después de listar, SIEMPRE pregunta: "¿Te gustaría saber más sobre alguno de estos, o exploramos otra área?"
4. Solo entra en detalles cuando el usuario elija un proyecto específico
5. Si hay más de 4 resultados, muestra los 4 más relevantes y menciona que hay más
6. SIEMPRE mantente en el contexto de los proyectos de Riwi. Si el usuario pregunta algo fuera de ese contexto (comida, deportes, noticias, etc.), 
responde amablemente que solo puedes ayudar con los proyectos de Riwi, pero recuerda que cuando 
pregunten por empresas tambien hace parte del foco del proyecto
7. Cuando el usuario pida más información de UN proyecto específico, habla SOLO de ese proyecto. NO muestres los demás proyectos en esa respuesta
8. Cuando apliques un filtro (por tecnología, nicho, etc.), muestra SOLO los proyectos que cumplen ese filtro, no todos
9. NO inventes proyectos. Usa ÚNICAMENTE los proyectos del listado que te fue proporcionado
10. El campo 'participantes' de cada proyecto contiene los nombres de los coders o desarrolladores que trabajaron en él, separados por coma. 
Cuando pregunten por el equipo, integrantes o coders de un proyecto, muestra esos nombres directamente. 
Si piden más información sobre un coder específico, indica que Riwi cuenta con RIWI TALENT, 
una plataforma donde se encuentra toda la información detallada de cada desarrollador.
"""
}

WELCOME_MESSAGES = {
    "staff": {
        "es": """¡Hola! Soy tu asistente comercial de Riwi. ¿Cómo quieres empezar?

**Filtrar proyectos** por lenguaje o tecnología  
**Filtrar por sector** o nicho de industria  
**Buscar info de una empresa** para sugerir proyectos afines  

¿Por cuál opción arrancamos, o tienes una búsqueda específica?""",
        "en": """Hi! I'm your Riwi commercial assistant. How would you like to start?

**Filter projects** by language or technology  
**Filter by sector** or industry niche  
**Research a company** to suggest matching projects  

Which works for you, or do you have a specific search in mind?"""
    },
    "client": {
        "es": """¡Bienvenido/a a Riwi! Estoy aquí para ayudarte a descubrir proyectos increíbles hechos por nuestros CODERS.

¿Cómo prefieres explorar?

**Ver proyectos que se ajusten a tu empresa**
**Explorar por área** — salud, finanzas, educación, comercio y más  
**Ver los mejor calificados**  

¿Por dónde empezamos?""",
        "en": """Welcome to Riwi! I'm here to help you discover amazing projects built by our students.

How would you like to explore?

**See projects that fit your company** — tell me what you do and I'll suggest the most relevant ones  
**Browse by area** — health, finance, education, commerce and more  
**See top-rated projects**  

Where shall we start?"""
    }
}

def _is_asking_for_more(message: str) -> bool:
    keywords = [
        "más", "mas", "detalle", "cuéntame", "cuentame", "explica",
        "ese", "este", "primero", "segundo", "tercero",
        "more", "detail", "tell me", "explain", "about"
    ]
    return any(k in message.lower() for k in keywords)


def _format_projects_summary(projects: list) -> str:
    summary = []
    for p in projects:
        summary.append({
            "titulo": p.get("titulo"),
            "descripcion_corta": p.get("descripcion_corta"),
            "nicho": p.get("nicho"),
            "tecnologias": p.get("tecnologias"),
            "calificacion": p.get("calificacion")
        })
    return json.dumps(summary, ensure_ascii=False, default=str)


def _format_projects_full(projects: list) -> str:
    return json.dumps(projects, ensure_ascii=False, default=str)

async def extract_filters(user_message: str) -> dict:
    """Extrae filtros explícitos del mensaje del usuario"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": """
                Analiza el mensaje y extrae filtros de búsqueda de proyectos.
                Responde SOLO con un JSON válido con estas claves (todas opcionales):
                {
                    "tecnologia": "nombre exacto de tecnología o null",
                    "nicho": "sector o industria o null",
                    "ruta": "ruta de estudio o null",
                    "cohorte": "periodo como 2025-1 o null",
                    "calificacion_min": número o null,
                    "search_term": "término general si no encaja en los anteriores o null"
                }
                Ejemplos:
                "proyectos de React" → {"tecnologia": "React"}
                "apps de salud" → {"nicho": "Salud"}
                "proyectos de React para salud" → {"tecnologia": "React", "nicho": "Salud"}
                "los mejor calificados" → {"calificacion_min": 4.5}
                "hola cómo estás" → {}
            """},
            {"role": "user", "content": user_message}
        ],
        max_tokens=100,
        temperature=0
    )
    try:
        return json.loads(response.choices[0].message.content)
    except Exception:
        return {}

async def detect_language(text: str) -> str:
    res = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Reply with only 'en' or 'es'. Language of: '{text}'"}],
        max_tokens=3,
        temperature=0
    )
    detected = res.choices[0].message.content.strip().lower()
    return detected if detected in ["en", "es"] else "es"

async def get_welcome_message(role: str, language: str = "es", company_name: str = None) -> str:
    lang = language if language in ["es", "en"] else "es"
    msg = WELCOME_MESSAGES.get(role, WELCOME_MESSAGES["client"])[lang]
    if role == "client" and company_name:
        prefix = (f"¡Hola, equipo de **{company_name}**! " if lang == "es"
                  else f"Hello, **{company_name}** team! ")
        msg = prefix + "\n\n" + msg
    return msg

async def chat_with_context(
    user_message: str,
    history: list,
    role: str = "client",
    company_name: str = None,
    company_profile: str = None,
    language: str = "auto"
):
    if language == "auto":
        language = await detect_language(user_message)

    lang_note = ("Always respond in English."
                    if language == "en" else "Responde siempre en español.")
    system_prompt = SYSTEM_PROMPTS.get(role, SYSTEM_PROMPTS["client"])

    # ← CAMBIO: extraer filtros del mensaje antes de consultar MySQL
    filters = await extract_filters(user_message)

    proyectos = await get_projects_filtered(
        search_term=filters.get("search_term"),
        nicho=filters.get("nicho"),
        tecnologia=filters.get("tecnologia"),
        ruta=filters.get("ruta"),
        cohorte=filters.get("cohorte"),
        calificacion_min=filters.get("calificacion_min")
    )
    if not proyectos:
        proyectos = await get_projects_filtered()  # fallback: todos

    if len(history) == 0 or _is_asking_for_more(user_message):
        contexto = _format_projects_full(proyectos)
    else:
        contexto = _format_projects_summary(proyectos)

    company_context = ""
    if company_name:
        company_context = f"\nEMPRESA ACTIVA: '{company_name}'."
    if company_profile:
        company_context += f"\nPERFIL: {company_profile}"

    messages = [
        {"role": "system", "content": (
            f"{system_prompt}\n{lang_note}\n{company_context}"
            f"\n\nPROYECTOS DISPONIBLES:\n{contexto}"
        )},
        *history[-10:],
        {"role": "user", "content": user_message}
    ]

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        max_tokens=700,
        temperature=0.4
    )

    response_text = response.choices[0].message.content

    # Filter grid to only projects mentioned in the response
    mentioned_projects = [
        p for p in proyectos
        if p.get("titulo") and p["titulo"].lower() in response_text.lower()
    ]

    return {
        "text": response_text,
        "language": language,
        "projects": mentioned_projects if mentioned_projects else proyectos,
        "filters_applied": filters
    }

async def generate_summary(project_data: dict, language: str = "es") -> str:
    lang_note = "Respond in English." if language == "en" else "Responde en español."
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"""
                Explica este proyecto en lenguaje simple, sin tecnicismos. {lang_note}
                Estructura:
                - ¿Qué hace? (1-2 oraciones simples)
                - ¿Para quién es útil?
                - ¿Por qué es interesante?
            """},
            {"role": "user", "content": json.dumps(project_data, ensure_ascii=False, default=str)}
        ],
        max_tokens=350
    )
    return response.choices[0].message.content