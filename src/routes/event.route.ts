import express from "express";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import {
  deleteEventController,
  getApprovedEventController,
  getEventByStatusController,
  getEventController,
  getOrganizedEventcontroller,
  postEventController,
  updateEventController,
} from "../controller/event.Controller";
import { getEventByStatusServices } from "../services/event.Services";

const eventRoutes = express.Router();

eventRoutes.get(
  "/",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  getEventController
);
eventRoutes.get(
  "/organizedevent/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  getOrganizedEventcontroller
);
eventRoutes.post(
  "/postevent",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  postEventController
);

eventRoutes.get(
  "/approvedevent",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  getApprovedEventController
);

eventRoutes.get(
  "/:status",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getEventByStatusController
);

eventRoutes.patch(
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
