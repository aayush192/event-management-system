import nodemailer from "nodemailer";
import apiError from "./apiError";
import config from "../config/config";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

export const sendMail = async (
  email: string,
  subject: string,
 html:string
) => {
  try {
      const info = await transporter.sendMail({
        from: config.EMAIL,
        to: email,
        subject: subject,
        html:html
      });
      return info;

  } catch (err) {
    throw new apiError(500, `${err}`);
  }
};
