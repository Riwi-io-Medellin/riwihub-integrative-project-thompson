
/**
 * @file coder.controllers.js
 * @description This file defines the controller functions for handling HTTP requests
 *              related to `coder` entities. It acts as an intermediary, receiving
 *              requests, delegating business logic to `coder.services.js`, and
 *              sending back appropriate HTTP responses.
 */

import * as coderService from "./coder.services.js";
import { handleError } from "../../utils/errorHandler.js";

/**
 * Handles requests to retrieve all coders.
 * Queries the `coderService` to fetch coder data and sends it as a JSON response.
 *
 * @param {import('express').Request} req - The Express request object, potentially containing query parameters for filtering.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with an array of coder objects.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const getCoders = async (req, res) => {
    try {

        // Delegate to the service layer to get all coders, possibly with query filters.
        const result = await coderService.getAllCoders(req.query);

        // Send a 200 OK response with the retrieved coder data.
        res.status(200).json(result);

    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to retrieve a single coder by their ID.
 * Extracts the coder ID from the request parameters and uses `coderService` to find the coder.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` should contain the coder's ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<e.Response<any, Record<string, any>>>} Sends a 200 (OK) status with the found coder object.
 *                          If an error occurs (e.g., coder not found), it delegates to `handleError`.
 */

export const getCoderById = async (req, res) => {
    try {

        // Delegate to the service layer to get a specific coder by ID.
        const coder = await coderService.getCoderById(req.params.id);
        res.json(coder);

    } catch (error) {

        handleError(res, error);
    }
};

/**
 * Handles requests to create a new coder.
 * Extracts coder data from the request body and uses `coderService` to save it.
 *
 * @param {import('express').Request} req - The Express request object. `req.body` should contain the new coder's data.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 201 (Created) status with a success message and the result of the creation.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const createCoder = async (req, res) => {
    try {

        // Delegate to the service layer to save the new coder data.
        const result = await coderService.saveCoder(req.body);
        res.status(201).json({ message: "Coder creado con éxito", result });
    } catch (error) {

        handleError(res, error);
    }
};

/**
 * Handles requests to update an existing coder.
 * Extracts the coder ID from `req.params` and updated data from `req.body`,
 * then uses `coderService` to perform the update.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` contains the coder's ID,
 *                                          and `req.body` contains the updated coder data.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with a success message.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const patchCoder = async (req, res) => {
    try {

        // Delegate to the service layer to update the coder by ID with the provided data.
        await coderService.updateCoder(req.params.id, req.body);
        res.json({ message: "Coder actualizado con éxito" });
    } catch (error) {

        handleError(res, error);
    }
};

/**
 * Handles requests to delete a coder by their ID.
 * Extracts the coder ID from `req.params` and uses `coderService` to delete the coder.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` should contain the coder's ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with a success message.
 *                          If an error occurs (e.g., coder not found), it delegates to `handleError`.
 */

export const removeCoder = async (req, res) => {
    try {

        // Delegate to the service layer to delete the coder by ID.
        await coderService.deleteCoder(req.params.id);
        res.json({ message: "Coder eliminado con éxito" });
    } catch (error) {

        handleError(res, error);
    }
};