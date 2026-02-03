import apiError from "../utils/apiError.utils";
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validateSchema = schema.parse(req.body);
            return next();
        }
        catch (err) {
            throw new apiError(400, `${err}`);
        }
    };
};
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validateSchema = schema.parse(req.params);
            return next();
        }
        catch (err) {
            throw new apiError(400, `${err}`);
        }
    };
};
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validateSchema = schema.parse(req.query);
            return next();
        }
        catch (err) {
            throw new apiError(400, `${err}`);
        }
    };
};
