import express from "express";
import {
  getRegisteredUserController,
  getUserByIdController,
  getUserController,
} from "../controller/user.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
const userRoutes = express.Router();

userRoutes.get(
  "/user",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserController
);
userRoutes.get(
  "/user/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserByIdController
);

userRoutes.get(
  "/user/registered/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  getRegisteredUserController
);
export default userRoutes;
