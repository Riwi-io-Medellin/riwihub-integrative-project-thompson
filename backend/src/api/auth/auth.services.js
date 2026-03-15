/**
 * @file auth.services.js
 * @description This file contains the core business logic for user authentication,
 *              including user registration, login, JWT token generation and refreshing,
 *              and logout functionality. It interacts with the database for user
 *              and token management and uses Zod for input validation and bcrypt
 *              for password hashing.
 */

// Import necessary modules
import { createConnectionPool } from "../../config/MySQL/mysql.db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ... existing code ...
import {checkLogin, updateLastLogin, checkRefreshToken, deleteRefreshToken} from "./auth.repository.js";
import { insertIntoTable } from "../../repositories/repository.js";


/**
 * @const {object} loginSchema
 * @description Zod schema for validating user login credentials.
 * @property {string} email - Must be a valid email format.
 * @property {string} password - Must be a string (password complexity handled by bcrypt later).
 */
const loginSchema = z.object({
    email: z.email(),
    password: z.string()
});

/**
 * Generates both an access token and a refresh token for a given user.
 * Tokens include user ID, email, role, and username, and have configurable expiration times.
 *
 * @param {object} user - The user object containing `user_id`, `email`, `role_name`, and `username`.
 * @returns {{accessToken: string, refreshToken: string}} An object containing the generated access and refresh tokens.
 */
const generateTokens = (user) => {

    // Generate an access token with user details and a short expiration (e.g., 1 day).
    const accessToken = jwt.sign(
        {
            userId: user.user_id,
            email: user.email,
            role: user.role_name,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Generate a refresh token with only user ID and a longer expiration (e.g., 3 days).
    const refreshToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '3d' } 
    );

    return { accessToken, refreshToken };
};

/**
 * Authenticates a user based on the provided email and password.
 * Validates credentials, checks password hash, updates last login time,
 * generates new tokens, and saves the refresh token to the database.
 *
 * @param {object} data - Object containing user login credentials (email, password).
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>} An object containing
 *          the authenticated user's public data and new authentication tokens.
 * @throws {Error} If the credentials are invalid ("INVALID_CREDENTIALS").
 */

export const loginUser = async (data) => {
    const validatedData = loginSchema.parse(data);

    // Search for the user by email, joining with the role table and checking if active.
    const users = await checkLogin(createConnectionPool, validatedData);

    if (!users || users.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = users[0];

    // Compare the provided password with the stored hashed password.
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Update the user's last login timestamp in the database.
    await updateLastLogin(createConnectionPool, user);

    // Generate new access and refresh tokens for the session.
    const tokens = generateTokens(user);

    // Calculate the expiration date for the refresh token
    const expiresAt = new Date();
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '3d';
    // Asumiendo que JWT_REFRESH_EXPIRES_IN es '3d' para 3 días.
    const days = parseInt(refreshExpiresIn.replace('d', '')); // Extraction of the number of days
    expiresAt.setDate(expiresAt.getDate() + days);

    // Save the refresh token
    await insertIntoTable(createConnectionPool, 'refresh_token', {
        user_id: user.user_id,
        token: tokens.refreshToken,
        expires_at: expiresAt
    });

    // Return the user data and tokens
    return {
        user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role_name
        },
        ...tokens
    };
};

/**
 * Refreshes an expired access token using a valid refresh token.
 * Verifies the refresh token, checks its validity against the database,
 * and generates a new access token.
 *
 * @param {string} oldRefreshToken - The refresh token provided by the client.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} An object containing the new access and refresh tokens.
 * @throws {Error} If the refresh token is invalid or expired ("INVALID_REFRESH_TOKEN").
 */
export const refreshAccessToken = async (oldRefreshToken) => {
    try {
        // 1. Check the old refresh token for validity.
        jwt.verify(oldRefreshToken, process.env.JWT_SECRET);

        // 2. Check if the refresh token is still valid in the database.
        const dbRefreshTokenEntry = await checkRefreshToken(createConnectionPool, oldRefreshToken);

        if (!dbRefreshTokenEntry) {
            // If not found or expired in the database, it's invalid.
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        // Extract user details from the database entry.
        const user = {
            user_id: dbRefreshTokenEntry.user_id,
            email: dbRefreshTokenEntry.email,
            role_name: dbRefreshTokenEntry.role_name,
            username: dbRefreshTokenEntry.username
        };

        // 3. Delete the old refresh token from the database.
        await deleteRefreshToken(createConnectionPool, oldRefreshToken);

        // 4. Create a new access token with the same user details.
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // 5. Calculate the expiration date for the new refresh token in the database (3 days)
        const expiresAt = new Date();
        const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '3d';
        const days = parseInt(refreshExpiresIn.replace('d', ''));
        expiresAt.setDate(expiresAt.getDate() + days);

        // 6. Save the new refresh token in the database.
        await insertIntoTable(createConnectionPool, 'refresh_token', {
            user_id: user.user_id,
            token: newRefreshToken,
            expires_at: expiresAt
        });

        // 7. Return the new access and refresh tokens.
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    } catch (error) {

        // Handle specific JWT verification errors.
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
        // Create a generic error message for other JWT verification errors.
        throw error;
    }
};

/**
 * Logs out a user by invalidating their refresh token in the database.
 * This effectively terminates the user's session.
 *
 * @param {string} refreshToken - The refresh token to be invalidated.
 * @returns {Promise<{message: string}>} A success message indicating logout.
 */

// Logout (invalidar refresh token)
export const logoutUser = async (refreshToken) => {

    // Delete the refresh token from the database to invalidate it.
    await deleteRefreshToken(createConnectionPool, refreshToken);

    // Return a success message.
    return { message: "Logout exitoso" };
};
