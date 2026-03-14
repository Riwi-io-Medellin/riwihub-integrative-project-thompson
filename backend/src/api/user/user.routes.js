
/**
 * @file user.routes.js
 * @description This file defines the API routes for managing `user` entities.
 *              It uses an Express Router to group these routes, linking them to
 *              the appropriate controller functions and applying authorization middleware
 *              to protect certain operations.
 */

import { Router } from "express";
import { authorize} from "../../middlewares/auth.middleware.js";
import * as userController from "./user.controllers.js";
import { validateNumericId } from "../../middlewares/validation.middleware.js";

export const userRouter = Router();


/**
 * Route for retrieving all users.
 * GET /api/users/
 */

userRouter.get('/', userController.getUsers);

/**
 * Route for retrieving a single coder by ID.
 * GET /api/users/:id
 */

userRouter.get('/:id', validateNumericId('id'), userController.getUserById);

/**
 * Route for creating a new coder.
 * Only users with the 'admin' role are permitted to create new coders.
 * POST /api/coders/
 */

userRouter.post('/', userController.register);


/**
 * Route for updating an existing user by ID.
 * Only users with the 'admin' role are permitted to modify user information.
 * PATCH /users/:id.
 */

userRouter.patch('/:id', authorize('admin'), validateNumericId('id'), userController.patchUser);

/**
 * Route for deleting a user by ID.
 * Only users with the 'admin' role are permitted to delete users.
 * DELETE /users/:id
 */

userRouter.delete('/:id', authorize('admin'), validateNumericId('id'), userController.removeUser);