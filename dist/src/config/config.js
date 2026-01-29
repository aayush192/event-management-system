import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
    quiet: true,
});
export default {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
