import express from "express";
import {
  getRegisteredEventController,
  userRegistrationController,
  deleteUserRegistrationController,
} from "../controller/registration.controller";
import { verifyTokenMiddleWare } from "../middlewares/auth.middleware.ts";
import { verifyAllowedRoleMiddleWare } from "../middlewares/verifyAllowedRole";
import { validateQuery } from "../middlewares/validate";
import { eventIdSchema, userIdSchema } from "../dataTypes/zod";

const registrationRoutes = express.Router();
registrationRoutes.post(
  "/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  // validateQuery(eventIdSchema),
  userRegistrationController
);

registrationRoutes.delete(
  "/delete/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  // validateQuery(eventIdSchema),
  deleteUserRegistrationController
);
registrationRoutes.get(
  "/registeredevent/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  // validateQuery(userIdSchema),
  getRegisteredEventController
);

export default registrationRoutes;
