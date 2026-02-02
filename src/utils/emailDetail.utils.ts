import crypto from "crypto";
import { prisma } from "../config/prisma.config";
import apiError from "./apiError.utils";
import { sendMail } from "./sendEmail.utils";
import { addMailInQueue } from "./emailQueue.utils";
export const emailDetailUtils = async (
  email: string,
  subject: string,
  message: string,
  baseUrl: string,
  purpose: "REGISTER_USER" | "RESET_PASSWORD"
) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  const hashedToken = crypto.createHash("sha512").update(token).digest("hex");

  const storeToken = await prisma.mailToken.create({
    data: {
      hashedToken: hashedToken,
      email: email,
      purpose,
      expiresAt: expiresIn,
    },
  });

  if (!storeToken) throw new apiError(500, "failed to store token");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">${subject}</h2>
    <p>${email}</p>
    <p>${message}</p>
    <p style="text-align: center;">
      <a href="${baseUrl}?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 5px;">Secure Your Account</a>
    </p>
    <p>Thanks,<br/>Event Managaement System</p>
  </div>
</body>
</html>`;

  const info = await addMailInQueue(email, subject, html);
  return info;
};
