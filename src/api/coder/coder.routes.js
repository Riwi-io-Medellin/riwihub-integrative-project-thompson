
/**
 * @file coder.routes.js
 * @description This file defines the API routes for managing `coder` entities.
 *              It uses an Express Router to group these routes, linking them to
 *              the appropriate controller functions and applying authorization middleware
 *              to protect certain operations.
 */

import { Router } from "express";
import {
    getCoders,
    getCoderById,
    createCoder,
    patchCoder,
    removeCoder
} from "./coder.controllers.js";
import { authorize } from "../../middlewares/auth.middleware.js";
import { validateNumericId } from "../../middlewares/validation.middleware.js";


export const coderRouter = Router();


/**
 * Route for retrieving all coders.
 * GET /api/coders/
 */

coderRouter.get('/', getCoders);


/**
 * Route for retrieving a single coder by ID.
 * GET /api/coders/:id
 */

coderRouter.get('/:id', validateNumericId('id'), getCoderById);

/**
 * Route for creating a new coder.
 * Only users with the 'admin' role are permitted to create new coders.
 * POST /api/coders/
 */

coderRouter.post('/', authorize('admin'), createCoder);


/**
 * Route for updating an existing coder by ID.
 * Only users with the 'admin' role are permitted to modify coder information.
 * PATCH /api/coders/:id.
 */

coderRouter.patch('/:id', validateNumericId('id'), authorize('admin'), patchCoder);

/**
 * Route for deleting a coder by ID.
 * Only users with the 'admin' role are permitted to delete coders.
 * DELETE /api/coders/:id
 */

coderRouter.delete('/:id', validateNumericId('id'), authorize('admin'), removeCoder);