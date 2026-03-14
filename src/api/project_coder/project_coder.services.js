/**
 * @file project_coder.services.js
 * @description This file provides the business logic for managing the association
 *              between projects and coders. It includes functions for creating
 *              new project-coder relationships and validates input data using Zod.
 */

import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod";
import {
    insertIntoTable,
} from "../../repositories/repository.js";

const table = "project_coder";

/**
 * @const {object} project_coderSchema
 * @description Zod schema for validating `project_coder` association data.
 * @property {number} project_id - Required, the unique identifier of the project. Must be at least 1.
 * @property {number} coder_id - Required, the unique identifier of the coder. Must be at least 1.
 */

const project_coderSchema = z.object({
    project_id : z.number().min(1),
    coder_id : z.number().min(1),
})

/**
 * Saves a new association between a project and a coder to the database.
 * The input data is validated against the `project_coderSchema`.
 *
 * @param {object} data - An object containing `project_id` and `coder_id` for the association.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the insert operation,
 *          typically containing `insertId` and `affectedRows`.
 * @throws {Error} If a database error occurs during the insertion process or validation fails.
 */

export const saveProjectCoders = async (data) => {
    const validatedData = project_coderSchema.parse(data);

    return  await insertIntoTable(createConnectionPool, table, validatedData);



}