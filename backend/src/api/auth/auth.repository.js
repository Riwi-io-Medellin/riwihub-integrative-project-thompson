/**
 * @file auth.repository.js
 * @description This file contains data access functions related to authentication,
 *              interacting directly with the database to manage user roles, login checks,
 *              last login updates, and refresh token management. These functions abstract
 *              the SQL queries for the authentication service.
 */

/**
 * Checks login credentials by searching for an active user with the given email and fetching their role.
 *
 * @param {import('mysql2/promise').Pool} createConnectionPool - The MySQL connection pool.
 * @param {object} validatedData - An object containing validated login data, including the user's `email`.
 * @returns {Promise<object | undefined>} A promise that resolves to the user object with their role name if found and active,
 *                                         or `undefined` if no such user exists or is not active.
 */

export async function checkLogin(createConnectionPool, validatedData) {

    // Search for the user by email, joining with the role table and checking if active.
    const [userChecked] = await createConnectionPool.query(`
        SELECT u.*, r.role_name
        FROM user u
        JOIN role r ON u.role_id = r.role_id
        WHERE u.email = ? AND u.is_active = TRUE
    `, [validatedData.email]);

    // The query returns an array; we expect at most one user.
    return userChecked ?? undefined;
}

/**
 * Updates the `last_login` timestamp for a given user in the database.
 *
 * @param {import('mysql2/promise').Pool} createConnectionPool - The MySQL connection pool.
 * @param {object} user - The user object, expected to contain `user_id`.
 * @returns {Promise<void>} A promise that resolves when the update operation is complete.
 */

export async function updateLastLogin(createConnectionPool, user) {

    // Update the user's last login timestamp in the database.
    await createConnectionPool.query(
        'UPDATE user SET last_login = NOW() WHERE user_id = ?',
        [user.user_id]
    );

}

/**
 * Checks if a refresh token exists in the database, is not expired, and belongs to an active user.
 *
 * @param {import('mysql2/promise').Pool} createConnectionPool - The MySQL connection pool.
 * @param {string} token - The refresh token string to check.
 * @returns {Promise<object | undefined>} A promise that resolves to the refresh token details along with
 *                                         associated user and role information if valid, or `undefined` otherwise.
 */

export async function checkRefreshToken(createConnectionPool, token) {

    // Check if the refresh token exists in the database and is still valid (not expired, user active).
    const [tokens] = await createConnectionPool.query(`
            SELECT rt.*, u.username, u.email, r.role_name
            FROM refresh_token rt
            JOIN user u ON rt.user_id = u.user_id
            JOIN role r ON u.role_id = r.role_id
            WHERE rt.token = ? AND rt.expires_at > NOW() AND u.is_active = TRUE
        `, [token]);

    // The query returns an array; we expect at most one token.
    return tokens ? tokens[0] : undefined;
}

/**
 * Deletes a specific refresh token from the database, effectively invalidating it.
 *
 * @param {import('mysql2/promise').Pool} createConnectionPool - The MySQL connection pool.
 * @param {string} refreshToken - The refresh token string to delete.
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete.
 */

export async function deleteRefreshToken(createConnectionPool, refreshToken) {

    // Delete the refresh token from the database to invalidate it.
    await createConnectionPool.query(
        'DELETE FROM refresh_token WHERE token = ?',
        [refreshToken]
    );

}