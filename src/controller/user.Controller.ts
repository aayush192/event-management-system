import { Request, Response } from "express";
import { getUserServices } from "../services/user.Services";
import {
  authLoginServices,
  authRegisterServices,
} from "../services/auth.Services";
export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const user = await getUserServices(Number(id));
  console.log(user);
  res.status(200).json({ user });
};

export const registerUserController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await authRegisterServices(data);
  res.status(200).json({ user });
};

export const loginUserController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await authLoginServices(data);
  res.status(200).json({ user });
};
