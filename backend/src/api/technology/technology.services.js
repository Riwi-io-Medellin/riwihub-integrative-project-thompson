/**
 * @file technology.services.js
 * @description This file provides the core business logic for managing `technology` entities.
 *              It includes functions for retrieving, creating, updating, and deleting technology records.
 *              This layer handles input validation using Zod and interacts with the database
 *              through generic repository functions.
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

const table = "technology";
const idField = "technology_id";
const nameField = "technology_name";

/**
 * @const {object} technologySchema
 * @description Zod schema for validating `technology` data.
 * @property {number} technology_id - Optional, represents the unique identifier of the technology.
 * @property {string} technology_name - Required string, must have at least 2 characters.
 */

const technologySchema = z.object({
    technology_id: z.number().optional(),
    technology_name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
});

/**
 * Retrieves a list of technologies based on provided filters.
 * If `id` or `name` filters are provided, it performs a specific search; otherwise, it returns all technologies.
 *
 * @param {object} [filters={}] - An object containing optional filters for technologies (e.g., `id`, `name`).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of technology objects.
 * @throws {Error} If no technology is found for the given `id` or `name` filter ("NOT_FOUND").
 */

export const getAllTechnologies = async (filters = {}) => {
    let result;
    if (filters.id) {
        result = await selectBy(createConnectionPool, table, idField, filters.id);
    } else if (filters.name) {
        result = await selectBy(createConnectionPool, table, nameField, filters.name);
    } else {
        result = await selectAll(createConnectionPool, table);
    }

    if ((filters.id || filters.name) && (!result || result.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return result || [];
};

/**
 * Retrieves a single technology by its unique ID.
 *
 * @param {number} id - The unique identifier of the technology.
 * @returns {Promise<Object>} A promise that resolves to the technology object.
 * @throws {Error} If no technology is found with the given ID ("NOT_FOUND").
 */

export const getTechnologyById = async (id) => {
    const tech = await selectBy(createConnectionPool, table, idField, id);
    if (!tech || (Array.isArray(tech) && tech.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return tech[0] || tech;
};


/**
 * Retrieves a single technology by its name.
 *
 * @param {string} name - The name of the technology.
 * @returns {Promise<Object>} A promise that resolves to the technology object.
 * @throws {Error} If no technology is found with the given name ("NOT_FOUND").
 */

export const getTechnologyByName = async (name) => {
    const tech = await selectBy(createConnectionPool, table, nameField, name);
    if (!tech || (Array.isArray(tech) && tech.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return tech[0] || tech;
};

/**
 * Saves one or more new technology records to the database.
 * The input data is validated against the `technologySchema` before insertion.
 * If a technology with the same name already exists, its ID is returned instead of creating a duplicate.
 *
 * @param {object | Array<object>} data - An object or an array of objects containing the new technology's data.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of IDs of the saved (or existing) technologies.
 * @throws {Error} If a database error occurs during the insertion process or validation fails.
 */

export const saveTechnology = async (data) => {
    if (Array.isArray(data)) {
        const techIds = [];
        for (const item of data) {
            const validatedData = technologySchema.parse(item);
            let existingTech = null;
            try {
                existingTech = await getTechnologyByName(validatedData.technology_name);
            } catch (error) {
                if (error.message !== "NOT_FOUND") throw error;
            }

            if (existingTech) {
                techIds.push(existingTech.technology_id);
            } else {
                const result = await insertIntoTable(createConnectionPool, table, validatedData);
                techIds.push(result.insertId);
            }
        }
        return techIds;
    } else {
        const validatedData = technologySchema.parse(data);
        const result = await insertIntoTable(createConnectionPool, table, validatedData);
        return [result.insertId];
    }
};

/**
 * Updates an existing technology record in the database.
 * The update data is partially validated against the `technologySchema` (allowing only some fields to be present).
 *
 * @param {number} id - The unique identifier of the technology to update.
 * @param {object} data - An object containing the fields to update and their new values.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the update operation.
 * @throws {Error} If no data is provided for the update ("NO_DATA_TO_UPDATE") or
 *                 if no technology is found with the given ID to update ("NOT_FOUND").
 */

export const updateTechnology = async (id, data) => {
    const partialSchema = technologySchema.partial();
    const validatedData = partialSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
        throw new Error("NO_DATA_TO_UPDATE");
    }

    const result = await updateTable(createConnectionPool, table, validatedData, idField, id);
    if (result.affectedRows === 0) throw new Error("NOT_FOUND");
    return result;
};

/**
 * Deletes a technology record from the database by its unique ID.
 *
 * @param {number} id - The unique identifier of the technology to delete.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the delete operation.
 * @throws {Error} If no technology is found with the given ID to delete ("NOT_FOUND").
 */

export const deleteTechnology = async (id) => {
    const result = await deleteFromTable(createConnectionPool, table, idField, id);
    if (result.affectedRows === 0) throw new Error("NOT_FOUND");
    return result;
};