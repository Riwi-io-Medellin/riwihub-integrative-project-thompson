/**
 * @file media_project.services.js
 * @description This file provides the core business logic for managing `media_project` entities.
 *              It includes functions for retrieving, creating, updating, and deleting media records
 *              associated with projects. This layer handles input validation using Zod and interacts
 *              with the database through generic repository functions.
 */

import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod";
import {
    selectAll,
    selectBy,
    insertIntoTable,
    updateTable,
    deleteFromTable
} from "../../repositories/repository.js";

const table = "media_project";
const idField = "media_project_id";

/**
 * @const {object} mediaProjectSchema
 * @description Zod schema for validating `media_project` data.
 * @property {string} media_url - Required, must be a valid URL.
 * @property {string} media_type - Optional enum ('image', 'video'), defaults to 'video'.
 * @property {number} project_id - Required, the ID of the project this media belongs to.
 */
const mediaProjectSchema = z.object({
    media_url: z.string().url({ message: "La URL del medio no es válida" }),
    media_type: z.enum(['image', 'video']).default('video'),
    project_id: z.number().min(1, "El ID del proyecto es obligatorio")
});

/**
 * Retrieves all media projects from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of media project objects.
 */
export const getAllMediaProjects = async () => {
    return await selectAll(createConnectionPool, table);
};

/**
 * Retrieves a single media project by its ID.
 * @param {number} id - The unique identifier of the media project.
 * @returns {Promise<Object>} A promise that resolves to the media project object.
 * @throws {Error} If no media project is found with the given ID ("NOT_FOUND").
 */
export const getMediaProjectById = async (id) => {
    const media = await selectBy(createConnectionPool, table, idField, id);
    if (!media || media.length === 0) {
        throw new Error("NOT_FOUND");
    }
    return media[0];
};

/**
 * Saves a new media project record or an array of them.
 * The input data is validated against the `mediaProjectSchema`.
 * @param {object|Array<object>} data - An object or an array of objects containing the media project data.
 * @returns {Promise<any>} A promise that resolves to the result of the insert operation.
 */
export const saveMediaProject = async (data) => {
    if (Array.isArray(data)) {
        const results = [];
        for (const item of data) {
            const validatedData = mediaProjectSchema.parse(item);
            const result = await insertIntoTable(createConnectionPool, table, validatedData);
            results.push(result);
        }
        return results;
    } else {
        const validatedData = mediaProjectSchema.parse(data);
        return await insertIntoTable(createConnectionPool, table, validatedData);
    }
};

/**
 * Updates an existing media project record.
 * The update data is partially validated against the `mediaProjectSchema`.
 * @param {number} id - The ID of the media project to update.
 * @param {object} data - An object containing the fields to update.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 * @throws {Error} If no data is provided ("NO_DATA_TO_UPDATE") or the media project is not found ("NOT_FOUND").
 */
export const updateMediaProject = async (id, data) => {
    const partialSchema = mediaProjectSchema.partial();
    const validatedData = partialSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
        throw new Error("NO_DATA_TO_UPDATE");
    }

    const resultUpdate = await updateTable(createConnectionPool, table, validatedData, idField, id);
    if (resultUpdate.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultUpdate;
};

/**
 * Deletes a media project record from the database by its ID.
 * @param {number} id - The ID of the media project to delete.
 * @returns {Promise<any>} A promise that resolves to the result of the delete operation.
 * @throws {Error} If the media project is not found ("NOT_FOUND").
 */
export const deleteMediaProject = async (id) => {
    const resultDelete = await deleteFromTable(createConnectionPool, table, idField, id);
    if (resultDelete.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultDelete;
};