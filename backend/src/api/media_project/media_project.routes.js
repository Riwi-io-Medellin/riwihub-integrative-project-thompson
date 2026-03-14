/**
 * @file media_project.routes.js
 * @description This file defines the API routes for managing `media_project` entities.
 *              It links endpoints to controller functions and applies necessary middleware
 *              for authentication, authorization, and validation.
 */

import { Router } from "express";
import {
    getMediaProjects,
    getMediaProjectById,
    createMediaProject,
    patchMediaProject,
    removeMediaProject
} from "./media_project.controllers.js";
import { authorize } from "../../middlewares/auth.middleware.js";
import { validateNumericId } from "../../middlewares/validation.middleware.js";

export const mediaProjectRouter = Router();

/**
 * Route for retrieving all media projects.
 * GET /api/media-projects/
 */
mediaProjectRouter.get('/', getMediaProjects);

/**
 * Route for retrieving a single media project by ID.
 * GET /api/media-projects/:id
 */
mediaProjectRouter.get('/:id', validateNumericId('id'), getMediaProjectById);

/**
 * Route for creating a new media project.
 * Protected: only users with 'admin' role can access.
 * POST /api/media-projects/
 */
mediaProjectRouter.post('/', authorize('admin'), createMediaProject);

/**
 * Route for updating an existing media project by ID.
 * Protected: only users with 'admin' role can access.
 * PATCH /api/media-projects/:id
 */
mediaProjectRouter.patch('/:id', validateNumericId('id'), authorize('admin'), patchMediaProject);

/**
 * Route for deleting a media project by ID.
 * Protected: only users with 'admin' role can access.
 * DELETE /api/media-projects/:id
 */
mediaProjectRouter.delete('/:id', validateNumericId('id'), authorize('admin'), removeMediaProject);