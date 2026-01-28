import express from "express";
import {
  changePasswordController,
  resetPasswordEmailController,
  loginUserController,
  refreshAccessTokenController,
  registerUserController,
  resetPasswordController,
  registerMailController,
} from "../controller/auth.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { validateBody } from "../middleWares/validate";
import {
  changePasswordSchema,
  getTokenSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
  resetTokenSchema,
  verifyOtpSchema,
} from "../dataTypes/dataTypes";
import { verify } from "node:crypto";
import { upload } from "../middleWares/multer";

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
  "/resetpassword/mail",
  validateBody(getTokenSchema),
  resetPasswordEmailController
);
authRoutes.patch(
  "/resetpassword",
  validateBody(resetPasswordSchema),
  resetPasswordController
);
authRoutes.patch("/refreshtoken", refreshAccessTokenController);

export default authRoutes;
