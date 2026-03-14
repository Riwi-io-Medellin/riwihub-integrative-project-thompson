
/**
 * Middleware para validar que un parámetro de ruta sea un número entero válido.
 * @param {string} paramName - El nombre del parámetro en req.params a validar (ej: 'id').
 */
export const validateNumericId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];

        // check if id is a number and positive
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ message: `El parámetro '${paramName}' debe ser un entero positivo.` });
        }
        next();
    };
};