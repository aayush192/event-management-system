import express from "express";
import { userRegistrationController } from "../controller/registration.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";

const registrationRoutes = express.Router();
registrationRoutes.post(
  "/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  userRegistrationController
);

export default registrationRoutes;
