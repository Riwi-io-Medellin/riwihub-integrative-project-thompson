/**
 * @file auth.routes.js
 * @description This file defines the API routes for all authentication-related operations.
 *              It utilizes an Express Router to group these routes, linking them to
 *              the appropriate controller functions and applying necessary middleware.
 *              Routes are categorized into public (accessible without authentication)
 *              and protected (requiring authentication).
 */

import { Router } from "express";
import { login, refresh, logout, getProfile } from "./auth.controllers.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

/**
 * @constant {Router} authRouter
 * @description An instance of an Express Router specifically for authentication routes.
 *              This router encapsulates all endpoints related to user registration,
 *              login, token management, and profile access.
 */

// Routes
export const authRouter = Router();


/**
 * Route for user login.
 * Allows existing users to authenticate and receive access/refresh tokens.
 * POST /api/auth/login
 */

authRouter.post('/login', login);

/**
 * Route for refreshing an access token.
 * Allows authenticated users to get a new access token using a valid refresh token.
 * POST /api/auth/refresh
 */

authRouter.post('/refresh', authenticate, refresh);

/**
 * Route for user logout.
 * Invalidates the provided refresh token, effectively ending the user's session.
 * POST /api/auth/logout
 */

authRouter.post('/logout', authenticate, logout);

// --- Protected Routes ---
// These routes require the `authenticate` middleware to verify the user's identity
// using a JWT before proceeding to the controller function.

/**
 * Route for retrieving the authenticated user's profile.
 * Requires a valid access token in the request headers to access.
 * GET /api/auth/profile
 */
authRouter.get('/profile', authenticate, getProfile);