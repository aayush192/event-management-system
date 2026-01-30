import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  authLoginServices,
  authRegisterServices,
  changePasswordServices,
  passwordResetMailServices,
  refreshAccessTokenServices,
  registerMailServices,
  resetPasswordServices,
} from "../services";
import {
  changePasswordType,
  getOtpType,
  getTokenType,
  loginType,
  registerUserType,
  resetPasswordType,
  verifyOtpType,
} from "../schemas";
import apiError from "../utils/apiError";
import { resHandler } from "../utils/responseHandler";

export const registerMailController = async (req: Request, res: Response) => {
  const data: getTokenType = req.body;
  const info = await registerMailServices(data.email);
  resHandler(res, 200, true, "sent mail successfully");
};

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token;
    const data: registerUserType = req.body;
    if (!req.file) throw new apiError(400, "profile image not provided");
    const info = await authRegisterServices(data, req.file, token as string);
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
    const data: changePasswordType = req.body;
    const info = await changePasswordServices(req.user!, data);
    return resHandler(res, 200, true, "password changed successfully", info);
  }
);
export const resetPasswordEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const user: getOtpType = req.body;
    const info = await passwordResetMailServices(user.email);
    return resHandler(res, 200, true, "send email successfully");
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token;
    const data: resetPasswordType = req.body;
    const info = await resetPasswordServices(token as string, data);
    return resHandler(res, 200, true, "password changed successfully", info);
  }
);

//refresh token controller
export const refreshAccessTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) throw new apiError(400, "missing refresh token");
    const info = await refreshAccessTokenServices(refreshToken);
    return resHandler(res, 200, true, "token refreshed successfully", info);
  }
);
