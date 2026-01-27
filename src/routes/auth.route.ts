import express from "express";
import {
  changePasswordController,
  getEmailController,
  loginUserController,
  refreshAccessTokenController,
  registerUserController,
  resetPasswordController,
  verifyOtpController,
} from "../controller/auth.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { getOtpServices } from "../services/auth.Services";
import { validateBody } from "../middleWares/validate";
import {
  changePasswordSchema,
  getOtpSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
  resetTokenSchema,
  verifyOtpSchema,
} from "../dataTypes/dataTypes";
import { verify } from "node:crypto";

const authRoutes = express.Router();

authRoutes.post("/login", validateBody(loginSchema), loginUserController);
authRoutes.post(
  "/register",
  validateBody(registerUserSchema),
  registerUserController
);
authRoutes.patch(
  "/changepassword",
  validateBody(changePasswordSchema),
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  changePasswordController
);
authRoutes.post("/otp", validateBody(getOtpSchema), getEmailController);
authRoutes.post("/verify", validateBody(verifyOtpSchema), verifyOtpController);
authRoutes.patch(
  "/resetpassword",
  validateBody(resetPasswordSchema),
  resetPasswordController
);
authRoutes.patch("/refreshtoken", refreshAccessTokenController);

export default authRoutes;
