import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  authLoginServices,
  authRegisterServices,
  changePasswordServices,
  getOtpServices,
  refreshAccessTokenServices,
  resetPasswordServices,
  verifyOtpServices,
} from "../services/auth.Services";
import {
  registerData,
  loginData,
  changePasswordData,
  getOtpData,
  VerifyOtpData,
  resetPasswordData,
} from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: registerData = req.body;
    const user = await authRegisterServices(data);
    if (!user) throw new Error("error while registering user");
    res.status(201).json({
      success: true,
      data: user,
      message: "user registered successfully",
    });
  }
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: loginData = req.body;
    const user = await authLoginServices(data);
    if (!user) throw new apiError(404, `can't find user having this email`);
    res
      .status(200)
      .json({ success: true, message: `user login successful`, data: user });
  }
);
export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: changePasswordData = req.body;
    const user = await changePasswordServices(data);
    res.status(200).json({
      success: true,
      message: `password changed successfully`,
      data: user,
    });
  }
);
export const getOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: getOtpData = req.body;
    const info = await getOtpServices(user.email);
    res.status(200).json({
      success: true,
      message: `otp send successfully`,
      data: info,
    });
  }
);
export const verifyOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: VerifyOtpData = req.body;
    const info = await verifyOtpServices(user.otp, user.email);
    res.status(200).json({
      success: true,
      message: `otp verified successfully`,
      data: info,
    });
  }
);
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: resetPasswordData = req.body;
    const info = await resetPasswordServices(user.token, user.newPassword);
    res.status(200).json({
      success: true,
      message: `otp verified successfully`,
      data: info,
    });
  }
);

//refresh token controller
export const refreshAccessTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new apiError(400, "missing refresh token");
    const data = await refreshAccessTokenServices(refreshToken);

    res
      .status(201)
      .json({ success: true, message: "token refreshed successfully", data });
  }
);
