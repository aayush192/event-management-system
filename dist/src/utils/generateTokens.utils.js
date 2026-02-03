import config from "../config/config";
import apiError from "./apiError.utils";
import jwt from "jsonwebtoken";
export const generateTokens = (User) => {
    if (!config.JWT_REFRESH_TOKEN_SECRET_KEY ||
        !config.JWT_REFRESH_TOKEN_EXPIRES_IN) {
        throw new apiError(500, "jwt config missing");
    }
    const accessToken = jwt.sign({ id: User.id, name: User.name, email: User.email, role: User.role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({
        id: User.id,
    }, config.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
};
