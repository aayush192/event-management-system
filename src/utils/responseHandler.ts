import { Response } from "express";
export const resHandler = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any
) => {
  if (!data) return res.status(statusCode).json({ success, message });

  res.status(statusCode).json({ success, message, data });
};
