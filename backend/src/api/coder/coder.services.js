
/**
 * @file coder.services.js
 * @description This file provides the core business logic for managing `coder` entities.
 *              It includes functions for retrieving, creating, updating, and deleting coder records.
 *              This layer handles input validation using Zod and interacts with the database
 *              through the generic repository functions.
 */

import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod"
import {
    selectAll,
    selectBy,
    insertIntoTable,
    updateTable,
    deleteFromTable

} from "../../repositories/repository.js";

const table = "coder";
const idField = "coder_id";
const nameField = "coder_name";

/**
 * @const {object} coderSchema
 * @description Zod schema for validating `coder` data.
 * @property {number} coder_id - Optional, represents the unique identifier of the coder.
 * @property {string} coder_name - Required string, must have at least 4 characters.
 */

const coderSchema = z.object({
    coder_id: z.number().optional(),
    coder_name: z.string().min(4, { message: "El nombre debe tener al menos 4 caracteres" })
});

/**
 * Retrieves a list of coders based on provided filters.
 * If `id` or `name` filters are provided, it performs a specific search; otherwise, it returns all coders.
 *
 * @param {object} [filters={}] - An object containing optional filters for coders (e.g., `id`, `name`).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of coder objects.
 * @throws {Error} If no coder is found for the given `id` or `name` filter ("NOT_FOUND").
 */

export const getAllCoders = async (filters = {}) => {
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
 * Retrieves a single coder by their unique ID.
 *
 * @param {number} id - The unique identifier of the coder.
 * @returns {Promise<Object>} A promise that resolves to the coder object.
 * @throws {Error} If no coder is found with the given ID ("NOT_FOUND").
 */

export const getCoderById = async (id) => {
    const coder =  await selectBy(createConnectionPool, table, idField, id);
    if (!coder || (coder instanceof Array && coder.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return coder[0] || coder;
};

/**
 * Retrieves a single coder by their name.
 *
 * @param {string} name - The name of the coder.
 * @returns {Promise<Object|null>} A promise that resolves to the coder object if found, otherwise `null`.
 */

export const getCoderByName = async (name) => {
    const coder = await selectBy(createConnectionPool, table, nameField, name);
    if (!coder || (coder instanceof Array && coder.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return coder[0] || coder;
};

/**
 * Saves a new coder record to the database.
 * The input data is validated against the `coderSchema` before insertion.
 *
 * @param {object} data - An object containing the new coder's data.
 * @returns {Promise<number[]>} A promise that resolves to the result of the insert operation.
 */

export const saveCoder = async (data) => {
    if (data instanceof Array) {
        const coderIds = [];
        for (const item of data) {
            const validatedData = coderSchema.parse(item);
            let existingCoder = null;

            try {
                existingCoder = await getCoderByName(validatedData.coder_name);
            } catch (error) {
                if (error.message !== "NOT_FOUND") throw error;
            }

            if (existingCoder) {
                coderIds.push(existingCoder.coder_id);
            } else {
                const result = await insertIntoTable(createConnectionPool, table, validatedData);
                coderIds.push(result.insertId);
            }
        }
        return coderIds; 
    } else {
        const validatedData = coderSchema.parse(data);
        const result = await insertIntoTable(createConnectionPool, table, validatedData);
        return [result.insertId]; 
    }

}

/**
 * Updates an existing coder record in the database.
 * The update data is partially validated against the `coderSchema` (allowing only some fields to be present).
 *
 * @param {number} id - The unique identifier of the coder to update.
 * @param {object} data - An object containing the fields to update and their new values.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the update operation.
 * @throws {Error} If no coder is found with the given ID to update ("NOT_FOUND").
 */

export const updateCoder = async (id, data) => {
    const partialSchema = coderSchema.partial();
    const validatedData = partialSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
        throw new Error("NO_DATA_TO_UPDATE");
    }

    const resultUpdate = await updateTable(createConnectionPool, table, validatedData, idField, id);
    if (resultUpdate.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultUpdate;
};


/**
 * Deletes a coder record from the database by their unique ID.
 *
 * @param {number} id - The unique identifier of the coder to delete.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the delete operation.
 * @throws {Error} If no coder is found with the given ID to delete ("NOT_FOUND").
 */

export const deleteCoder = async (id) => {
    const resultDelete = await deleteFromTable(createConnectionPool, table, idField, id);
    if (resultDelete.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultDelete;
};
