import apiError from "./apiError.utils.js";
import config from "../config/config.js";
import { transporter } from "../config/index.js";
export const sendMail = async (email, subject, html) => {
    try {
        console.log(email);
        const info = await transporter.sendMail({
            from: config.EMAIL,
            to: email,
            subject: subject,
            html: html,
        });
        return info;
    }
    catch (err) {
        throw new apiError(500, `${err}`);
    }
};
