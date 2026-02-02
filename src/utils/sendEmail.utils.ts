import nodemailer from "nodemailer";
import apiError from "./apiError.utils";
import config from "../config/config";
import {transporter} from '../config'

export const sendMail = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    console.log(email)
    const info = await transporter.sendMail({
      from: config.EMAIL,
      to: email,
      subject: subject,
      html: html,
    });
    return info;
  } catch (err) {
    throw new apiError(500, `${err}`);
  }
};
