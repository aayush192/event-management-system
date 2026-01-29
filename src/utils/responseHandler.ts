import { Response } from "express";
export const resHandler = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  if (!data) {
    return res.status(statusCode).json({ success, message });
  }
  return res.status(statusCode).json({ success, message, data });
};
