import express from "express";
import { getRegisteredEventController, userRegistrationController, userUnregistrationController, } from "../controller/registration.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
const registrationRoutes = express.Router();
registrationRoutes.post("/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), userRegistrationController);
registrationRoutes.delete("/remove/:eventId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), userUnregistrationController);
registrationRoutes.get("/registeredevent/:userId", verifyTokenMiddleWare, verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"), getRegisteredEventController);
export default registrationRoutes;
