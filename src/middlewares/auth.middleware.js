/**
 * @file auth.middleware.js
 * @description This file contains Express middleware functions for authentication and authorization.
 *              The `authenticate` middleware verifies JWTs to ensure a user is logged in,
 *              and the `authorize` middleware checks if an authenticated user has the necessary roles
 *              to access a particular resource.
 */

import jwt from "jsonwebtoken";


/**
 * Middleware function to authenticate requests using JSON Web Tokens (JWT).
 * It expects a JWT in the 'Authorization' header in the format 'Bearer <token>'.
 * If the token is valid, it decodes it and attaches the user information to `req.user`.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} Calls `next()` to pass control to the next middleware/route handler,
 *                 or sends a 401 (Unauthorized) response if authentication fails.
 */
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the 'Authorization' header is present and starts with 'Bearer'.
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Token no proporcionado"
            });
        }

        // Extract the token from the header
        const token = authHeader.substring(7);

        // Verify the token
        // If the token is valid, attach the decoded user information to the request object.
        // This makes user data (like userId, email, role, username) available to later handlers.
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { userId, email, role, username }

        // Proceed to the next middleware or route handler in the chain.
        next();

    } catch (error) {

        // Handle specific JWT verification errors.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expirado",
                expired: true
            });
        }

        // For any other JWT verification error (e.g., malformed, invalid signature),
        // send a generic 401 Unauthorized response.
        return res.status(401).json({
            message: "Token inválido"
        });
    }
};

/**
 * Middleware factory function to authorize access based on user roles.
 * It returns a middleware that checks if the authenticated user's role
 * is among the list of allowed roles for a particular route.
 * This middleware should be used after the `authenticate` middleware.
 *
 * @param {...string} allowedRoles - A variable number of string arguments representing the roles that are permitted to access the resource.
 * @returns {import('express').RequestHandler} An Express middleware function.
 *                                            Calls `next()` if the user is authorized,
 *                                            sends a 401 (Unauthorized) if not authenticated,
 *                                            or a 403 (Forbidden) if authenticated but not authorized.
 */

export const authorize = (...allowedRoles) => {

    // This inner function is the actual middleware that Express will execute.
    return (req, res, next) => {

        // Ensure that `req.user` (populated by `authenticate` middleware) exists.
        // If not, the user is not authenticated.
        if (!req.user) {
            return res.status(401).json({
                message: "No autenticado"
            });
        }

        // Check if the authenticated user's role is included in the array of allowed roles.
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a este recurso"
            });
        }

        // If the user is authenticated and has an allowed role, proceed to the next handler.
        next();
    };
};