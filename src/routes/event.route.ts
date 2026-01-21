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
  postEventImagesController,
  updateEventController,
} from "../controller/event.Controller";
import { getEventByStatusServices } from "../services/event.Services";
import { upload } from "../middleWares/multer";

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
  upload.single("image"),
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
eventRoutes.post(
  "/postimage/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER "),
  upload.array("images", 5),
  postEventImagesController
);

eventRoutes.delete(
  "/delete/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  deleteEventController
);

export default eventRoutes;
