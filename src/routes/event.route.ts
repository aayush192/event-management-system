import express from "express";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import {
  deleteEventController,
  deleteEventImagesController,
  getApprovedEventController,
  getEventByStatusController,
  getEventController,
  getOrganizedEventcontroller,
  postEventController,
  postEventImagesController,
  updateEventController,
  updateEventStatusController,
} from "../controller/event.Controller";
import { getEventByStatusServices } from "../services/event.Services";
import { upload } from "../middleWares/multer";

const eventRoutes = express.Router();

eventRoutes.get(
  "/",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN", "USER"),
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
  upload.single("coverImage"),
  postEventController
);

eventRoutes.get(
  "/:status",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getEventByStatusController
);

eventRoutes.patch(
  "/update/event/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  updateEventController
);

eventRoutes.patch(
  "/update/status/:status",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  updateEventStatusController
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
eventRoutes.delete(
  "/delete/image/:eventImageId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  deleteEventImagesController
);



export default eventRoutes;
