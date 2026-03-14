import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import {
    selectAll,
    selectBy,
    insertIntoTable,
    updateTable,
    deleteFromTable

} from "../../repositories/repository.js";
import { z } from "zod";
import {getUserRole, createPasswordHash, getAllUsersWithRole} from "./user.repository.js";

const table = "user";
const idField = "user_id";
const nameField = "email";


export const getAllUsers = async (filters)  => {
    let result;

    if (filters.id) {
        result = await selectBy(createConnectionPool, table, idField, filters.id);

    } else if (filters.email) {
        result = await selectBy(createConnectionPool, table, nameField, filters.email);

    } else {
    result = await getAllUsersWithRole(createConnectionPool);
    }
    // } else {
    //     result = await selectAll(createConnectionPool, table);
    // }

    if ((filters.id || filters.name) && (!result || result.length === 0)) {
        throw new Error("NOT_FOUND");
    }

    return result || [];
};

export const getUserById = async (id) => {
    const user =  await selectBy(createConnectionPool, table, idField, id);
    if (!user || (user instanceof Array && user.length === 0)) {
        throw new Error("NOT_FOUND");
    }
    return user[0] || user;
};


/**
 * @const {object} registerSchema
 * @description Zod schema for validating user registration data.
 * @property {string} username - Must be a string with a minimum length of 3 and maximum of 50 characters.
 * @property {string} email - Must be a valid email format.
 * @property {string} password - Must be a string with a minimum length of 8 characters.
 * @property {string} role_name - Optional enum ('admin', 'cliente', 'comercial'), defaults to 'cliente'.
 */
const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.email(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    telephone: z.string().optional(),
    company: z.string().optional(),
    role_name: z.enum(['admin', 'cliente', 'comercial']).optional().default('cliente')
});


/**
 * Registers a new user in the database.
 * Performs input validation, checks for existing users, hashes the password,
 * and generates initial access and refresh tokens for the new user.
 *
 * @param {object} data - Object containing user registration details (username, email, password, role_name).
 * @returns {Promise<{user: {id: *, username: *, email: *, role: *}}>} An object containing
 *          the new user's public data and their authentication tokens.
 * @throws {Error} If a user with the given email already exists ("USER_ALREADY_EXISTS"),
 *                 o if an invalid role is provided ("INVALID_ROLE").
 */
export const registerUser = async (data) => {

    // Validate the incoming data against the registerSchema.
    const validatedData = registerSchema.parse(data);

    // Check if a user with the provided email already exists.
    const existingUser = await selectBy(createConnectionPool, 'user', 'email', validatedData.email);
    if (existingUser && existingUser.length > 0) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    // Retrieve the role ID based on the provided role name.
    const [role] = await selectBy(createConnectionPool, 'role', 'role_name', validatedData.role_name);
    if (!role) {
        throw new Error("INVALID_ROLE");
    }

    // Hash the user's password for secure storage.
    const password_hash = await createPasswordHash(validatedData.password);

    // Prepare user data for insertion into the database.
    const userData = {
        username: validatedData.username,
        email: validatedData.email,
        password_hash: password_hash,
        role_id: role.role_id,
        telephone: validatedData.telephone,
        company: validatedData.company
    };

    // Insert the new user into the 'user' table.
    const result = await insertIntoTable(createConnectionPool, 'user', userData);

    // Fetch the newly created user along with their role name to include in the token.
    const newUser = await getUserRole(createConnectionPool, result);

    if (!newUser) {
        throw new Error("No se pudo recuperar la información del nuevo usuario después del registro.");
    }

    return {
        user: {
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role_name
        }
    };
};

export const updateUser = async (id, data) => {
    const partialSchema = registerSchema.partial();
    const validatedData = partialSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
        throw new Error("NO_DATA_TO_UPDATE");
    }

    const updateFields = { ...validatedData };

    if (validatedData.password) {
        updateFields.password_hash = await createPasswordHash(validatedData.password);
        delete updateFields.password;
    }

    if (validatedData.role_name) {
        const [role] = await selectBy(createConnectionPool, 'role', 'role_name', validatedData.role_name);
        if (!role) {
            throw new Error("INVALID_ROLE");
        }
        updateFields.role_id = role.role_id;
        delete updateFields.role_name;
    }

    const resultUpdate = await updateTable(createConnectionPool, table, updateFields, idField, id);
    if (resultUpdate.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultUpdate;
};

export const deleteUser = async (id) => {
    const resultDelete = await deleteFromTable(createConnectionPool, table, idField, id);
    if (resultDelete.affectedRows === 0) throw new Error("NOT_FOUND");
    return resultDelete;
};