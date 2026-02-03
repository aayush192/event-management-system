import dotenv from "dotenv";
import { valiadateEnv } from "../schemas";
import apiError from "../utils/apiError.utils";
dotenv.config({
  path: "./.env",
  quiet: true,
});

 process.env.NODE_ENV === "production" ? dotenv.config({
  path: "./.env.production"
}) :
  dotenv.config({
    path:"./.env"
  })
const env = valiadateEnv.parse(process.env);
export default {
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
  PORT: env.PORT,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,

  JWT_REFRESH_TOKEN_SECRET_KEY: env.JWT_REFRESH_TOKEN_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRES_IN: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: env.CLOUDINARY_API_SECRET,

  EMAIL: env.EMAIL,
  PASSWORD: env.PASSWORD,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  JWT_VALIDATE_SECRET: process.env.JWT_VALIDATE_SECRET,
  JWT_VALIDATE_TOKEN_EXPIRES_IN: process.env.JWT_VALIDATE_TOKEN_EXPIRES_IN,
};
