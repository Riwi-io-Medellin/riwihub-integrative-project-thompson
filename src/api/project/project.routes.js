
/**
 * @file project.routes.js
 * @description This file defines the API routes for managing `project` entities.
 *              It uses an Express Router to group these routes, linking them to
 *              the appropriate controller functions and applying authorization middleware
 *              to protect certain operations.
 */

import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsWithAll}
    from "./project.controllers.js";
import {authorize} from "../../middlewares/auth.middleware.js";
import { validateNumericId } from "../../middlewares/validation.middleware.js";

// Routes
export const projectRouter = Router();

/**
 * Route for retrieving all projects.
 * GET /api/projects/
 */


projectRouter.get('/',  getProjects);

/**
 * Route for retrieving a single project by ID.
 * GET /api/projects/:id
 */

projectRouter.get('/all', getProjectsWithAll);

projectRouter.get('/:id', validateNumericId('id'), getProjectById);

/**
 * Route for creating a new project.
 * Only users with the 'admin' role are permitted to create new projects.
 * POST /api/projects/
 */

projectRouter.post('/', authorize('admin'), createProject);

/**
 * Route for updating an existing project by ID.
 * Only users with the 'admin' role are permitted to modify project information.
 * PATCH /api/projects/:id.
 */

projectRouter.patch('/:id', authorize('admin'), validateNumericId('id'), updateProject);

/**
 * Route for deleting a project by ID.
 * Only users with the 'admin' role are permitted to delete projects.
 * DELETE /api/projects/:id
 */

projectRouter.delete('/:id', authorize('admin'), validateNumericId('id'), deleteProject);
