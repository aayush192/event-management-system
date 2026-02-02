import config from "../config/config";
import { userType } from "../dataTypes/zod";
import apiError from "./apiError.utils";
import jwt, { Jwt, SignOptions } from "jsonwebtoken";
export const generateTokens = (User: userType) => {
  if (
    !config.JWT_REFRESH_TOKEN_SECRET_KEY ||
    !config.JWT_REFRESH_TOKEN_EXPIRES_IN
  ) {
    throw new apiError(500, "jwt config missing");
  }

  const accessToken = jwt.sign(
    { id: User.id, name: User.name, email: User.email, role: User.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"] | "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: User.id,
    },
    config.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN as
        | SignOptions["expiresIn"]
        | "5d",
    }
  );

  return { accessToken, refreshToken };
};
