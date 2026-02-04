import express from "express";
import { getRegisteredEventController, userRegistrationController, deleteUserRegistrationController, } from "../controller/index.js";
import { verifyTokenMiddleWare, validateParams, verifyAllowedRoleMiddleWare } from "../middlewares/index.js";
import { eventIdSchema, userIdSchema } from "../schemas/index.js";
const registrationRoutes = express.Router();
registrationRoutes.post("/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(eventIdSchema), userRegistrationController);
registrationRoutes.delete("/delete/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(eventIdSchema), deleteUserRegistrationController);
registrationRoutes.get("/registeredevent/:userId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), validateParams(userIdSchema), getRegisteredEventController);
export default registrationRoutes;
