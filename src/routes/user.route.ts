import express from "express";
import { getUserController } from "../controller/user.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
const userRoutes = express.Router();

userRoutes.get(
  "/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserController
);
export default userRoutes;
