
/**
 * @file project.services.js
 * @description This file provides the core business logic for managing `project` entities.
 *              It includes functions for retrieving, creating, updating, and deleting project records,
 *              along with their associated coders, technologies, and media. This layer handles
 *              input validation using Zod and interacts with the database through generic repository functions.
 */

import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod"
import {
    selectAll,
    selectAllWithJoin,
    selectBy,
    insertIntoTable,
    updateTable,
    deleteFromTable

} from "../../repositories/repository.js";

import { saveProjectCoders } from "../project_coder/project_coder.services.js";
import { saveProjectTechnologies } from "../project_technology/project_technology.services.js";
import {saveUserProject} from "../user_project_save/user_project_save.services.js";
import {saveMediaProject} from "../media_project/media_project.services.js";

const table = "project";
const idField = "project_id";
const nameField = "project_name";

/**
 * @const {object} projectSchema
 * @description Zod schema for validating `project` data.
 * @property {string} project_name - Required string, must have at least 4 characters.
 * @property {string} short_description - Optional string, must have at least 4 characters.
 * @property {string} complete_description - Optional string, must have at least 4 characters.
 * @property {string} nicho - Required string, must have at least 4 characters.
 * @property {string} project_link - Optional URL string.
 * @property {string} github_link - Optional URL string.
 * @property {('Básica'|'Avanzada'|'Complementos'|'Otra')} route_level - Required enum value.
 * @property {number} rating - Optional number, must be between 0 and 5.
 * @property {string} cohort - Optional string, must have at least 1 character.
 */

const projectSchema = z.object({
     project_name : z.string().min(4, { message: "El nombre debe tener al menos 4 caracteres" }),
     short_description : z.string()
         .min(4, { message: "La descripción debe tener al menos 4 caracteres" }).optional(),
     complete_description : z.string()
         .min(4, { message: "La descripción debe tener al menos 4 caracteres" }).optional(),
     nicho: z.string().min(4, { message: "El nicho debe tener al menos 4 caracteres" }),
     project_link: z.string().optional(),
     github_link: z.string().optional(),
     route_level : z.enum(['Básica', 'Avanzada', 'Complementos', 'Otra']),
     rating : z.number().min(0, { message: "La calificación debe ser mayor a 0" }).max(5,
    { message: "La calificación debe ser menor o igual a 5" }).optional(),
     cohort: z.string().min(1, { message: "La cohorte debe ser mayor o igual a 1" }).optional()
 })


/**
 * Retrieves all projects from the database, including associated coder names and technology names,
 * by performing a join operation across multiple tables. It groups related data for each project.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of project objects,
 *                                    each including an array of associated coders and technologies.
 * @throws {Error} If a database error occurs during the selection process.
 */

export const getAllProjectsJoin = async () => {
    const fields = "p.*, c.coder_name, t.technology_name";
    const baseTable = ["project p"];
    const joins = [
        "LEFT JOIN project_coder pc ON p.project_id = pc.project_id",
        "LEFT JOIN coder c ON pc.coder_id = c.coder_id",
        "LEFT JOIN project_technology pt ON p.project_id = pt.project_id",
        "LEFT JOIN technology t ON pt.technology_id = t.technology_id"
    ];

    const rows = await selectAllWithJoin(
        createConnectionPool,
        fields,
        baseTable,
        joins
    );

    // Group the projects by project_id and include coders and technologies
    const projectsMap = rows.reduce((acc, row) => {
        const { project_id, coder_name, technology_name, ...projectData } = row;

        if (!acc[project_id]) {
            acc[project_id] = {
                project_id,
                ...projectData,
                coders: [],
                technologies: []
            };
        }

        // Add coder if exists and not already in the list
        if (coder_name && !acc[project_id].coders.some(c => c.name === coder_name)) {
            acc[project_id].coders.push({ name: coder_name});
        }

        // Add technology if exists and not already in the list
        if (technology_name && !acc[project_id].technologies.includes(technology_name)) {
            acc[project_id].technologies.push(technology_name);
        }

        return acc;
    }, {});

    return Object.values(projectsMap);
};

/**
 * Retrieves a list of projects based on provided filters.
 * Can filter by project ID or name, or return all projects if no filters are specified.
 *
 * @param {object} [filters={}] - An object containing optional filters for projects (e.g., `id`, `name`).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of project objects.
 * @throws {Error} If no project is found for the given `id` or `name` filter ("NOT_FOUND").
 */

export const getAllProjects = async (filters) => {

    let response;

    // If the filters object is empty, return all projects
    if (filters.id) {
        response = await selectBy(createConnectionPool, table, idField, filters.id);

    } else if (filters.name) {
        response = await selectBy(createConnectionPool, table, nameField, filters.name);

    } else {
        response = await selectAll(createConnectionPool, table);
    }

    if ((filters.id || filters.name) && (!response || response.length === 0)) {
        throw new Error("NOT_FOUND");
    }

    return response || [];
};

/**
 * Retrieves a single project by its unique ID.
 *
 * @param {number} id - The unique identifier of the project.
 * @returns {Promise<Object>} A promise that resolves to the project object.
 * @throws {Error} If no project is found with the given ID ("NOT_FOUND").
 */

export const getProjectById = async (id) => {

    const project =  await selectBy(createConnectionPool, table, idField, id);

    if (!project || (project instanceof Array && project.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return project[0] || project;

};

/**
 * Saves a new project record to the database, along with its associated coders, technologies,
 * media, and links it to a user.
 * The input data for the project is validated against the `projectSchema` before insertion.
 *
 * @param {object} data - An object containing the new project's data, coder IDs, technology IDs, user ID, and media data.
 * @param {Array<number>} data.coderIds - Array of coder IDs associated with the project.
 * @param {Array<number>} data.technologyIds - Array of technology IDs associated with the project.
 * @param {number} data.userId - The ID of the user creating the project.
 * @param {Array<object>} data.mediaData - Array of media objects associated with the project.
 * @returns {Promise<{project_id: number, insertId: number}>} A promise that resolves to an object
 *          containing the ID of the newly created project and the database insert result.
 * @throws {Error} If a database error occurs during the insertion process or validation fails.
 */

export const saveProject = async (data) => {
    const { coderIds, technologyIds, userId, mediaData, ...projectData } = data;
    const validatedData = projectSchema.parse(projectData);

    const result = await insertIntoTable(createConnectionPool, table, validatedData);
    const project_id = result.insertId;


    // If coderIds or technologyIds are provided, save them as project_coders and project_technologies
    if (coderIds && coderIds.length > 0) {
        for (const id of coderIds) {
            await saveProjectCoders({
                project_id: project_id,
                coder_id: id
            });
        }
    }

    // If technologyIds are provided, save them as project_technologies
    if (technologyIds && technologyIds.length > 0) {
        for (const id of technologyIds) {
            await saveProjectTechnologies({
                project_id: project_id,
                technology_id: id
            });
        }
    }

    // If mediaData is provided, save it as media_project
    if (mediaData && mediaData.length > 0) {
        for (const media of mediaData) {
            await saveMediaProject({
                ...media,
                project_id: project_id
            });
        }
    }

    // If userId is provided, save it as user_project
    if (userId) {
        await saveUserProject({
            user_id: userId,
            project_id: project_id
        });
    }

    return { project_id, ...result };
};

/**
 * Updates an existing project record in the database.
 * The update data is partially validated against the `projectSchema` (allowing only some fields to be present).
 *
 * @param {number} id - The unique identifier of the project to update.
 * @param {object} data - An object containing the fields to update and their new values.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the update operation.
 * @throws {Error} If no data is provided for the update ("NO_DATA_TO_UPDATE") or
 *                 if no project is found with the given ID to update ("NOT_FOUND").
 */

export const updateProject = async (id, data) => {
    const partialSchema = projectSchema.partial();
    const validatedData = partialSchema.parse(data);

    // If no data is provided, throw an error
    if (Object.keys(validatedData).length === 0) {
        throw new Error("NO_DATA_TO_UPDATE");
    }

    // If no data is provided, throw an error
    const resultUpdate = await updateTable(createConnectionPool, table, validatedData, idField, id);
    if (resultUpdate.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultUpdate;
};

/**
 * Deletes a project record from the database by its unique ID.
 *
 * @param {number} id - The unique identifier of the project to delete.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the delete operation.
 * @throws {Error} If no project is found with the given ID to delete ("NOT_FOUND").
 */

export const deleteProject = async (id) => {

    // If no data is provided, throw an error
    const resultDelete = await deleteFromTable(createConnectionPool, table, idField, id);
    if (resultDelete.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultDelete;
};