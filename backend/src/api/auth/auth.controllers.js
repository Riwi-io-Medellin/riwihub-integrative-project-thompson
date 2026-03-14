/**
 * @file auth.controller.js
 * @description This file defines the controller functions for authentication-related API endpoints.
 *              It acts as the entry point for HTTP requests concerning user registration, login,
 *              token refreshing, and logout, delegating the core business logic to `auth.services.js`.
 *              It handles request parsing, invokes service layer functions, and formats HTTP responses.
 */

// Import service functions for authentication logic and a general error handler.
// These functions abstract the business logic away from the controller.
// ... existing code ...
import {loginUser, refreshAccessToken, logoutUser} from "./auth.services.js";
import { handleError } from "../../utils/errorHandler.js";

/**
 * Controller function to handle user login.
 * It expects user login credentials (email and password) in the request body.
 * @param {Object} req - The Express request object, containing login credentials in `req.body`.
 * @param {Object} res - The Express response object, used to send back success or error messages.
 */

export const login = async (req, res) => {
    try {

        // Call the service layer to authenticate the user with the provided credentials.
        const result = await loginUser(req.body);

        const { refreshToken, ...userData } = result;


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        // If login is successful, respond with a 200 status (OK) and a success message,
        // along with the data returned by the service (e.g., user info and accessToken).

        res.status(200).json({
            message: "Login exitoso",
            data: userData // Ahora userData no incluye el refreshToken
        });

        // If an error occurs during login, delegate error handling to a centralized utility.
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Controller function to handle refreshing an access token.
 * It expects a refresh token in the request body.
 * @param {Object} req - The Express request object, containing the `refreshToken` in `req.body`.
 * @param {Object} res - The Express response object, used to send back success or error messages.
 */

export const refresh = async (req, res) => {
    try {
        // Refresh access token
        // Get the refresh token from the request cookies.
        const oldRefreshToken = req.cookies.refreshToken;

        // Check if a refresh token was provided.
        if (!oldRefreshToken) {
            return res.status(400).json({ message: "Refresh token requerido" });
        }

        // Call the service layer to generate a new access token using the refresh token.
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshAccessToken(oldRefreshToken);

        // Create a new cookie with the new refresh token and set its expiration time.
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 días en milisegundos para la cookie, consistente con el backend
        });

        // If the token is successfully refreshed, respond with a 200 status (OK) and a success message,
        res.status(200).json({
            message: "Token renovado",
            data: { accessToken: newAccessToken } // Send the new access token in the response
        });

    } catch (error) {

        // If an error occurs during token refresh, delegate error handling to a centralized utility.
        handleError(res, error);
    }
};

/**
 * Controller function to handle user logout.
 * It expects a refresh token in the request body to invalidate it.
 * @param {Object} req - The Express request object, containing the `refreshToken` in `req.body`.
 * @param {Object} res - The Express response object, used to send back success or error messages.
 */
export const logout = async (req, res) => {
    try {

        // Logout a user
        const refreshToken = req.cookies.refreshToken;

        // Call the service layer to log out the user by invalidating their refresh token.
        await logoutUser(refreshToken);

        // Al hacer logout, también eliminamos la cookie del refresh token del navegador.
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // If logout is successful, respond with a 200 status (OK) and a success message.
        res.status(200).json({ message: "Logout exitoso" });
    } catch (error) {

        // If an error occurs during logout, delegate error handling to a centralized utility.
        handleError(res, error);
    }
};

/**
 * Controller function to get the authenticated user's profile.
 * This function assumes that the `authenticate` middleware has already run
 * and attached the user object to `req.user`.
 * @param {Object} req - The Express request object, containing the authenticated user's data in `req.user`.
 * @param {Object} res - The Express response object, used to send back the user's profile data.
 */

export const getProfile = async (req, res) => {
    try {
        // The user object is attached to the request by the `authenticate` middleware.
        // Respond with a 200 status (OK) and the user's profile data.

        res.status(200).json({
            data: req.user
        });
    } catch (error) {

        // If an error occurs (though less likely in simple profile retrieval after authentication),
        // delegate error handling to a centralized utility.
        handleError(res, error);
    }
};

