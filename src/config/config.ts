import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
  quiet: true,
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
