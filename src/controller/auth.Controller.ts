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
  changePasswordType,
  getOtpType,
  loginType,
  registerUserType,
  resetPasswordType,
  verifyOtpType,
} from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";
import { resHandler } from "../utils/responseHandler";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: registerUserType = req.body;
    const info = await authRegisterServices(data);
    resHandler(res, 201, true, "user registered successfully", info);
  }
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: loginType = req.body;
    const info = await authLoginServices(data);
    return resHandler(res, 200, true, "user logged in successfully", info);
  }
);
export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const data: changePasswordType = req.body;
    const info = await changePasswordServices(user, data);
    return resHandler(res, 200, true, "password changed successfully", info);
  }
);
export const getEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: getOtpType = req.body;
    const info = await getOtpServices(user.email);
    return resHandler(res, 200, true, "send email successfully");
  }
);
export const verifyOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: verifyOtpType = req.body;
    const info = await verifyOtpServices(user.otp, user.email);
    return resHandler(res, 200, true, "otp verified successfully", info);
  }
);
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token;
    const user: resetPasswordType = req.body;
    const info = await resetPasswordServices(token as string, user.newPassword);
    return resHandler(res, 200, true, "password changed successfully", info);
  }
);

//refresh token controller
export const refreshAccessTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new apiError(400, "missing refresh token");
    const info = await refreshAccessTokenServices(refreshToken);

    return resHandler(res, 200, true, "token refreshed successfully", info);
  }
);
