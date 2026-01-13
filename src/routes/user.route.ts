import express from "express";
import { getUserController } from "../controller/user.Controller";
import {
  loginUserController,
  registerUserController,
} from "../controller/auth.Controller";
import { authLoginServices } from "../services/auth.Services";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { postEventController } from "../controller/event.Controller";
const userRoutes = express.Router();

userRoutes.get(
  "/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserController
);
userRoutes.post("/login", loginUserController);
userRoutes.post("/register", registerUserController);
userRoutes.post("/event", verifyTokenMiddleWare, postEventController);
export default userRoutes;
