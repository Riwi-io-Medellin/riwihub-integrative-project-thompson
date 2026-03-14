
import { handleError } from "../../utils/errorHandler.js";
import * as userService from "./user.services.js";


export const getUsers = async (req, res) => {
    try {

        // Delegate to the service layer to get all users, possibly with query filters.
        const result = await userService.getAllUsers(req.query);

        // Send a 200 OK response with the retrieved coder data.
        res.status(200).json(result);

    } catch (error) {
        handleError(res, error);
    }
};

export const getUserById = async (req, res) => {
    try {
        // Extract the user ID from the request parameters.
        // Delegate to the service layer to get a specific user by ID.
        const user = await userService.getUserById(req.params.id);
        res.json(user);

    } catch (error) {

        handleError(res, error);
    }
};


export const register = async (req, res) => {
    try {

        // If registration is successful, respond with a 201 status (Created) and a success message,
        // along with the data returned by the service (e.g., user info and tokens).

        const result = await userService.registerUser(req.body);
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            data: result
        });

        // If an error occurs during registration, delegate error handling to a centralized utility.
    } catch (error) {
        handleError(res, error);
    }
};


export const patchUser = async (req, res) => {
    try {

        // Delegate to the service layer to update the user by ID with the provided data.
        await userService.updateUser(req.params.id, req.body);
        res.json({ message: "Usuario actualizado con éxito" });
    } catch (error) {

        handleError(res, error);
    }
};


export const removeUser = async (req, res) => {
    try {

        // Delegate to the service layer to delete the user by ID.
        await userService.deleteUser(req.params.id);
        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {

        handleError(res, error);
    }
};