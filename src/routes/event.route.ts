import express from "express";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import {
  deleteEventController,
  postEventController,
  updateEventController,
} from "../controller/event.Controller";

const eventRoutes = express.Router();

eventRoutes.post(
  "/",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  postEventController
);

eventRoutes.post(
  "/update",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  updateEventController
);

eventRoutes.delete(
  "/delete/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  deleteEventController
);
export default eventRoutes;
