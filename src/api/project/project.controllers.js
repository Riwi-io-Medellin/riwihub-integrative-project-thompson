/**
 * @file project.controllers.js
 * @description This file defines the controller functions for handling HTTP requests
 *              related to `project` entities. It orchestrates complex operations like
 *              creating a project with its associated coders, technologies, and media.
 */

import * as projectService from "./project.services.js";
import * as coderService from "../coder/coder.services.js";
import { handleError } from "../../utils/errorHandler.js";
import * as technologyService from "../technology/technology.services.js";


/**
 * Handles requests to retrieve all projects with their associated coders and technologies.
 * This function performs a join operation to gather comprehensive project details.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */

export const getProjectsWithAll = async (req, res) => {
    try {
        let projects;

        projects = await projectService.getAllProjectsJoin();
        res.status(200).json(projects);

    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Handles requests to retrieve all projects, with optional filtering.
 * It can filter projects based on query parameters provided in the request.
 * @param {import('express').Request} req - The Express request object, which may contain query parameters for filtering.
 * @param {import('express').Response} res - The Express response object.
 */

export const getProjects = async (req, res) => {

    try {

        let projects = await projectService.getAllProjects(req.query);

        res.status(200).json(projects);

    } catch (error) {
        handleError(res, error);
    }
};


/**
 * Handles requests to retrieve a single project by its ID.
 * Extracts the project ID from the request parameters.
 * @param {import('express').Request} req - The Express request object, with the project ID in `req.params.id`.
 * @param {import('express').Response} res - The Express response object.
 */

export const getProjectById = async (req, res) => {
    try {
        // Extract the coder ID from the request parameters.
        // Delegate to the service layer to get a specific project by ID.
        const project = await projectService.getProjectById(req.params.id);
        res.json(project);

    } catch (error) {

        handleError(res, error);
    }

}

/**
 * Handles requests to create a new project along with its related entities.
 * It processes a request body that includes data for the project itself,
 * as well as associated coders, technologies, and media files. The project is
 * linked to the authenticated user who creates it.
 * @param {import('express').Request} req - The Express request object, containing project, coder, technology, and media data in `req.body` and user info in `req.user`.
 * @param {import('express').Response} res - The Express response object.
 */

export const createProject = async (req, res) => {
    try {
        const { coders: codersData, technologies: techData, media: mediaData, ...projectData } = req.body;
        const userId = req.user.userId;

        // Check if codersData and techData are arrays before saving them to the database.
        const coderIds = codersData ? await coderService.saveCoder(codersData) : [];
        const technologyIds = techData ? await technologyService.saveTechnology(techData) : [];

        // Save the project along with its associated entities.
        const result = await projectService.saveProject({
            ...projectData,
            userId,
            coderIds,
            technologyIds,
            mediaData
        });

        res.status(201).json({
            message: "Proyecto, colaboradores, tecnologías y media creados con éxito",
            result
        });
    } catch (error) {
        handleError(res, error);
    }
};


/**
 * Handles requests to update an existing project by its ID.
 * Extracts the project ID from `req.params` and the updated data from `req.body`.
 * @param {import('express').Request} req - The Express request object, with project ID in `req.params.id` and update data in `req.body`.
 * @param {import('express').Response} res - The Express response object.
 */

export const updateProject = async (req, res) => {

    try {

        // Delegate to the service layer to update the project by ID with the provided data.
        await projectService.updateProject(req.params.id, req.body);
        res.json({ message: "Coder actualizado con éxito" });

    } catch (error) {

        handleError(res, error);
    }

}

/**
 * Handles requests to delete a project by its ID.
 * Extracts the project ID from the request parameters.
 * @param {import('express').Request} req - The Express request object, with the project ID in `req.params.id`.
 * @param {import('express').Response} res - The Express response object.
 */

export const deleteProject = async (req, res) => {

    try {
        // Delegate to the service layer to delete the project by ID.
        await projectService.deleteProject(req.params.id);
        res.json({ message: "Coder eliminado con éxito" });
    } catch (error) {

        handleError(res, error);
    }
}