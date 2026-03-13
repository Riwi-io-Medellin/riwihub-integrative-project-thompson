/**
 * @file technology.routes.js
 * @description This file defines the API routes for managing `technology` entities.
 *              It uses an Express Router to group these routes, linking them to
 *              the appropriate controller functions and applying authorization middleware
 *              to protect certain operations.
 */

import { Router } from "express";
import {
    getTechnologies,
    getTechnologyById,
    createTechnology,
    patchTechnology,
    removeTechnology
} from "./technology.controllers.js";
import { authorize } from "../../middlewares/auth.middleware.js";
import { validateNumericId } from "../../middlewares/validation.middleware.js";

/**
 * @constant {Router} technologyRouter
 * @description An instance of an Express Router specifically for technology-related routes.
 *              This router encapsulates all endpoints for CRUD operations on technologies.
 */

export const technologyRouter = Router();

/**
 * Route for retrieving all technologies.
 * GET /api/technologies/
 */

technologyRouter.get('/', getTechnologies);

/**
 * Route for retrieving a single technology by ID.
 * Applies `validateNumericId` middleware to ensure the 'id' parameter is valid.
 * GET /api/technologies/:id
 */

technologyRouter.get('/:id', validateNumericId('id'), getTechnologyById);

/**
 * Route for creating a new technology.
 * Only users with the 'admin' role are permitted to create new technologies.
 * POST /api/technologies/
 */

technologyRouter.post('/', authorize('admin'), createTechnology);

/**
 * Route for updating an existing technology by ID.
 * Only users with the 'admin' role are permitted to modify technology information.
 * Applies `validateNumericId` middleware to ensure the 'id' parameter is valid.
 * PATCH /api/technologies/:id
 */

technologyRouter.patch('/:id', authorize('admin'), validateNumericId('id'), patchTechnology);

/**
 * Route for deleting a technology by ID.
 * Only users with the 'admin' role are permitted to delete technologies.
 * Applies `validateNumericId` middleware to ensure the 'id' parameter is valid.
 * DELETE /api/technologies/:id
 */

technologyRouter.delete('/:id', authorize('admin'), validateNumericId('id'), removeTechnology);