import express from "express";
import {
  loginUserController,
  registerUserController,
  getUserController,
} from "../controller/user.Controller";
import { authLoginServices } from "../services/auth.Services";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
const userRoutes = express.Router();

userRoutes.get(
  "/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserController
);
userRoutes.post("/login", loginUserController);
userRoutes.post("/register", registerUserController);

export default userRoutes;
