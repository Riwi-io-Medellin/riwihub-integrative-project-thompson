/**
 * @file technology.controllers.js
 * @description This file defines the controller functions for handling HTTP requests
 *              related to `technology` entities. It acts as an intermediary, receiving
 *              requests, delegating business logic to `technology.services.js`, and
 *              sending back appropriate HTTP responses.
 */

import * as technologyService from "./technology.services.js";
import { handleError } from "../../utils/errorHandler.js";

/**
 * Handles requests to retrieve all technologies.
 * Queries the `technologyService` to fetch technology data and sends it as a JSON response.
 *
 * @param {import('express').Request} req - The Express request object, potentially containing query parameters for filtering.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with an array of technology objects.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const getTechnologies = async (req, res) => {
    try {
        const result = await technologyService.getAllTechnologies(req.query);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to retrieve a single technology by its ID.
 * Extracts the technology ID from the request parameters and uses `technologyService` to find the technology.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` should contain the technology's ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with the found technology object.
 *                          If an error occurs (e.g., technology not found), it delegates to `handleError`.
 */

export const getTechnologyById = async (req, res) => {
    try {
        const tech = await technologyService.getTechnologyById(req.params.id);
        res.json(tech);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to create a new technology.
 * Extracts technology data from the request body and uses `technologyService` to save it.
 *
 * @param {import('express').Request} req - The Express request object. `req.body` should contain the new technology's data.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 201 (Created) status with a success message and the result of the creation.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const createTechnology = async (req, res) => {
    try {
        const result = await technologyService.saveTechnology(req.body);
        res.status(201).json({ message: "Tecnología creada con éxito", result });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to update an existing technology.
 * Extracts the technology ID from `req.params` and updated data from `req.body`,
 * then uses `technologyService` to perform the update.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` contains the technology's ID,
 *                                          and `req.body` contains the updated technology data.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with a success message.
 *                          If an error occurs, it delegates to `handleError`.
 */

export const patchTechnology = async (req, res) => {
    try {
        await technologyService.updateTechnology(req.params.id, req.body);
        res.json({ message: "Tecnología actualizada con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to delete a technology by its ID.
 * Extracts the technology ID from `req.params` and uses `technologyService` to delete the technology.
 *
 * @param {import('express').Request} req - The Express request object. `req.params.id` should contain the technology's ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a 200 (OK) status with a success message.
 *                          If an error occurs (e.g., technology not found), it delegates to `handleError`.
 */

export const removeTechnology = async (req, res) => {
    try {
        await technologyService.deleteTechnology(req.params.id);
        res.json({ message: "Tecnología eliminada con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};