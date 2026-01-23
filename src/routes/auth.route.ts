import express from "express";
import {
  changePasswordController,
  getOtpController,
  loginUserController,
  refreshAccessTokenController,
  registerUserController,
  resetPasswordController,
  verifyOtpController,
} from "../controller/auth.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { getOtpServices } from "../services/auth.Services";
const authRoutes = express.Router();

authRoutes.post("/login", loginUserController);
authRoutes.post("/register", registerUserController);
authRoutes.patch(
  "/changepassword",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  changePasswordController
);
authRoutes.post("/otp", getOtpController);
authRoutes.post("/verify", verifyOtpController);
authRoutes.patch("/reset", resetPasswordController);
authRoutes.patch("/refreshtoken", refreshAccessTokenController);

export default authRoutes;
