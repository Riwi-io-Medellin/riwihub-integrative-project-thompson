import aiomysql

from config import settings

async def get_connection():
    return await aiomysql.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        db=settings.DB_NAME
    )

async def get_projects_filtered(
    search_term: str = None,
    nicho: str = None,
    tecnologia: str = None,
    ruta: str = None,
    cohorte: str = None,
    calificacion_min: float = None
):
    connection = await get_connection()
    async with connection.cursor(aiomysql.DictCursor) as cursor:
        conditions, params = [], []

        if search_term:
            conditions.append(
                "(p.project_name LIKE %s OR p.short_description LIKE %s "
                "OR p.complete_description LIKE %s)"
            )
            params += [f"%{search_term}%"] * 3
        if nicho:
            conditions.append("p.nicho LIKE %s")
            params.append(f"%{nicho}%")
        if tecnologia:
            conditions.append("t.technology_name LIKE %s")
            params.append(f"%{tecnologia}%")
        if ruta:
            conditions.append("p.route_level LIKE %s")
            params.append(f"%{ruta}%")
        if cohorte:
            conditions.append("p.cohort = %s")
            params.append(cohorte)
        if calificacion_min is not None:
            conditions.append("p.rating >= %s")
            params.append(calificacion_min)

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        await cursor.execute(f"""
            SELECT 
                p.project_id,
                p.project_name      AS titulo,
                p.short_description AS descripcion_corta,
                p.complete_description AS descripcion_completa,
                p.nicho,
                p.project_link      AS link_despliegue,
                p.route_level       AS ruta_estudio,
                p.cohort            AS corte,
                p.rating            AS calificacion,
                GROUP_CONCAT(DISTINCT t.technology_name ORDER BY t.technology_name SEPARATOR ', ') AS tecnologias,
                GROUP_CONCAT(DISTINCT c.coder_name ORDER BY c.coder_name SEPARATOR ', ')           AS participantes
            FROM project p
            LEFT JOIN project_technology pt ON p.project_id = pt.project_id
            LEFT JOIN technology t          ON pt.technology_id = t.technology_id
            LEFT JOIN project_coder pc      ON p.project_id = pc.project_id
            LEFT JOIN coder c               ON pc.coder_id = c.coder_id
            {where}
            GROUP BY p.project_id
            ORDER BY p.rating DESC
            LIMIT 30
        """, params)

        result = await cursor.fetchall()
    connection.close()
    return result