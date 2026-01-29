import { Response } from "express";
export const resHandler = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null,
  meta?: any
) => {
  return res.status(statusCode).json({ success, message, data, meta });
};
