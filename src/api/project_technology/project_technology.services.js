/**
 * @file project_technology.services.js
 * @description This file encapsulates the business logic for managing the relationships
 *              between projects and technologies. It provides functions to create new
 *              associations, ensuring data integrity through Zod validation.
 */

import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod";
import { insertIntoTable } from "../../repositories/repository.js";

const table = "project_technology";


/**
 * @const {object} projectTechnologySchema
 * @description Zod schema for validating data that associates a project with a technology.
 * @property {number} project_id - Required, the unique identifier of the project. Must be at least 1.
 * @property {number} technology_id - Required, the unique identifier of the technology. Must be at least 1.
 */

const projectTechnologySchema = z.object({
    project_id: z.number().min(1),
    technology_id: z.number().min(1),
});

/**
 * Saves a new association between a project and a technology to the database.
 * The input data is rigorously validated against the `projectTechnologySchema`.
 *
 * @param {object} data - An object containing `project_id` and `technology_id` for the association.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the insert operation,
 *          typically including `insertId` and `affectedRows`.
 * @throws {Error} If a database error occurs during the insertion process or if validation of the input data fails.
 */

export const saveProjectTechnologies = async (data) => {
    const validatedData = projectTechnologySchema.parse(data);
    return await insertIntoTable(createConnectionPool, table, validatedData);

};