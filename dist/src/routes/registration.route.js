import express from "express";
import { getRegisteredEventController, userRegistrationController, deleteUserRegistrationController, } from "../controller";
import { verifyTokenMiddleWare, validateParams, verifyAllowedRoleMiddleWare } from "../middlewares";
import { eventIdSchema, userIdSchema } from "../schemas";
const registrationRoutes = express.Router();
registrationRoutes.post("/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(eventIdSchema), userRegistrationController);
registrationRoutes.delete("/delete/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(eventIdSchema), deleteUserRegistrationController);
registrationRoutes.get("/registeredevent/:userId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(userIdSchema), getRegisteredEventController);
export default registrationRoutes;
