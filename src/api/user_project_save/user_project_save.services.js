import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod";
import { insertIntoTable } from "../../repositories/repository.js";

const table = "user_project_save";

/**
 * @const {object} userProjectSaveSchema
 * @description Zod schema for validating user-project associations.
 */
const userProjectSaveSchema = z.object({
    user_id: z.number().min(1, "El ID de usuario es obligatorio"),
    project_id: z.number().min(1, "El ID del proyecto es obligatorio"),
});

/**
 * Saves a new user-project association.
 * @param {object} data - An object containing `user_id` and `project_id`.
 * @returns {Promise<any>} The result of the insert operation.
 */
export const saveUserProject = async (data) => {
    const validatedData = userProjectSaveSchema.parse(data);
    return await insertIntoTable(createConnectionPool, table, validatedData);
};