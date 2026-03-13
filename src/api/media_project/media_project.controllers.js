/**
 * @file media_project.controllers.js
 * @description This file defines the controller functions for handling HTTP requests
 *              related to `media_project` entities. It orchestrates requests by calling
 *              service-layer functions and formats the HTTP responses.
 */

import * as mediaProjectService from "./media_project.services.js";
import { handleError } from "../../utils/errorHandler.js";

/**
 * Handles requests to retrieve all media projects.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getMediaProjects = async (req, res) => {
    try {
        const result = await mediaProjectService.getAllMediaProjects();
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to retrieve a single media project by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getMediaProjectById = async (req, res) => {
    try {
        const media = await mediaProjectService.getMediaProjectById(req.params.id);
        res.json(media);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to create a new media project.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const createMediaProject = async (req, res) => {
    try {
        const result = await mediaProjectService.saveMediaProject(req.body);
        res.status(201).json({ message: "Media del proyecto creada con éxito", result });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to update an existing media project.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const patchMediaProject = async (req, res) => {
    try {
        await mediaProjectService.updateMediaProject(req.params.id, req.body);
        res.json({ message: "Media del proyecto actualizada con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to delete a media project by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const removeMediaProject = async (req, res) => {
    try {
        await mediaProjectService.deleteMediaProject(req.params.id);
        res.json({ message: "Media del proyecto eliminada con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};