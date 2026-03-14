from openai import AsyncOpenAI
from config import settings
import json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def research_company_and_suggest(
    company_name: str,
    projects: list,
    language: str = "es"
) -> dict:
    lang_note = "Respond in English." if language == "en" else "Responde en español."

    # Reserach Company
    profile_res = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": (
                f"En máximo 2 oraciones, describe a qué sector pertenece "
                f"'{company_name}' y qué tipo de trabajo realizan."
            )}
        ],
        max_tokens=120,
        temperature=0.3
    )
    profile = profile_res.choices[0].message.content

    #sugest projects
    suggestions_res = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"""
                Eres asesor tecnológico de Riwi. {lang_note}
                Dado el perfil de una empresa y el catálogo de proyectos estudiantiles,
                sugiere máximo 4 proyectos ordenados por relevancia.
                Para cada uno explica brevemente por qué le sería útil a esa empresa,
                en lenguaje no técnico.
            """},
            {"role": "user", "content": (
                f"Empresa: {company_name}\n"
                f"Perfil: {profile}\n"
                f"Proyectos: {json.dumps(projects, ensure_ascii=False, default=str)}"
            )}
        ],
        max_tokens=600,
        temperature=0.4
    )

    return {
        "profile": profile,
        "suggestions": suggestions_res.choices[0].message.content
    }