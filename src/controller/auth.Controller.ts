import { Request, Response } from "express";
import {
  authLoginServices,
  authRegisterServices,
} from "../services/auth.Services";

export const registerUserController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await authRegisterServices(data);
  res.status(200).json({
    success: true,
    data: user,
    message: "user registered successfully",
  });
};

export const loginUserController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await authLoginServices(data);
  res.status(200).json({ user });
};
