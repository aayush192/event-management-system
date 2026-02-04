import nodemailer from "nodemailer";
import config from "./config.js";
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
    },
});
