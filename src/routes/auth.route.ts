import express from "express";
import {
  changePasswordController,
  resetPasswordEmailController,
  loginUserController,
  refreshAccessTokenController,
  registerUserController,
  resetPasswordController,
  registerMailController,
} from "../controller";
import { verifyTokenMiddleWare } from "../middlewares/auth.middleware.ts";
import { verifyAllowedRoleMiddleWare } from "../middlewares/verifyAllowedRole";
import { validateBody } from "../middlewares/validate";
import {
  changePasswordSchema,
  getTokenSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
  resetTokenSchema,
  verifyOtpSchema,
} from "../dataTypes/zod";
import { verify } from "node:crypto";
import { upload } from "../middlewares/multer";

const authRoutes = express.Router();

authRoutes.post("/login", validateBody(loginSchema), loginUserController);

authRoutes.post(
  "/register/mail",
  validateBody(getTokenSchema),
  registerMailController
);
authRoutes.post(
  "/register",
  upload.single("image"),
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
authRoutes.post(
  "/forget-password",
  validateBody(getTokenSchema),
  resetPasswordEmailController
);
authRoutes.patch(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPasswordController
);
authRoutes.patch("/refreshtoken", refreshAccessTokenController);

export default authRoutes;
