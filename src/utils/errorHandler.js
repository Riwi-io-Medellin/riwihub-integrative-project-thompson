/**
 * @file errorHandler.js
 * @description This file provides a centralized error handler function designed to streamline
 *              error responses across controllers. It categorizes common application errors
 *              (like authentication, validation, and database errors) and sends appropriate
 *              HTTP status codes and messages to the client.
 */

/**
 * Centralized error handler for Express controllers.
 * This function inspects the type and message of a caught error and sends a standardized
 * HTTP response to the client. It helps maintain consistent error formatting across the API.
 *
 * @param {import('express').Response} res - The Express response object, used to send the HTTP error.
 * @param {Error} error - The captured error object from a `try...catch` block.
 * @returns {void} Sends an HTTP response with an appropriate status code and error message.
 */

export const handleError = (res, error) => {

    // Handles specific error messages related to user authentication.
    if (error.message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
            status: "error",
            message: "El usuario ya existe con ese email o username."
        });
    }

    // Handles specific error messages related to user authentication.
    if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({
            status: "error",
            message: "Credenciales inválidas."
        });
    }

    // Handles specific error messages related to user authentication.
    if (error.message === "INVALID_REFRESH_TOKEN") {
        return res.status(401).json({
            status: "error",
            message: "Refresh token inválido o expirado."
        });
    }

    // Handles specific error messages related to user authentication.
    if (error.message === "INVALID_ROLE") {
        return res.status(400).json({
            status: "error",
            message: "Rol inválido."
        });
    }

    // Handles cases where a requested resource cannot be found.
    if (error.message === "NOT_FOUND") {
        return res.status(404).json({
            status: "error",
            message: "El recurso solicitado no existe."
        });
    }

    // Handles cases where a requested resource cannot be found.
    if (error.message === "NO_DATA_TO_UPDATE") {
        return res.status(400).json({
            status: "error",
            message: "No se proporcionaron datos para actualizar."
        });
    }

    // Handles cases where a requested resource cannot be found.
    if (error.message === "TIMESTAMP_REQUIRED") {
        return res.status(400).json({
            status: "error",
            message: "Falta la marca de tiempo (updated_at) para la validación de concurrencia."
        });
    }

    // Handles cases where a requested resource cannot be found.
    if (error.message === "CONFLICT") {
        return res.status(409).json({
            status: "error",
            message: "Conflicto de concurrencia. El recurso ha sido modificado por otra persona."
        });
    }

    // Catches validation errors typically thrown by Zod schemas.
    if (error.name === "ZodError" || error.issues) {
        return res.status(400).json({
            status: "fail",
            message: "Error de validación en los datos enviados.",
            details: error.errors || error.issues
        });
    }

    // Handles specific MySQL duplicate entry errors (ER_DUP_ENTRY).
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            status: "error",
            message: "Ya existe un registro con esos datos (entrada duplicada)."
        });
    }

    console.error("[Server Error]:", error);
    res.status(500).json({
        status: "error",
        message: "Ocurrió un error interno en el servidor.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};