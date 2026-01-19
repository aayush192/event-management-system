import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  authLoginServices,
  authRegisterServices,
} from "../services/auth.Services";
interface registerData {
  name: string;
  email: string;
  role: string;
  password: string;
}

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: registerData = req.body;
    const user = await authRegisterServices(data);
    if (!user) throw new Error("error while registering user");
    res.status(200).json({
      success: true,
      data: user,
      message: "user registered successfully",
    });
  }
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const user = await authLoginServices(data);
    if (!user) throw new Error(`can't find user having this email`);
    res.status(200).json({ user });
  }
);
