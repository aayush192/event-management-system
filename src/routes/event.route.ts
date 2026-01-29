import express from "express";
import { verifyTokenMiddleWare } from "../middlewares/auth.middleware.ts.js";
import { verifyAllowedRoleMiddleWare } from "../middlewares/verifyAllowedRole.js";
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
import { upload } from "../middlewares/multer.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.js";
import {
  createEventSchema,
  eventIdSchema,
  eventImageIdSchema,
  searchEventSchema,
  statusSchema,
  updateEventSchema,
  updateEventStatusSchema,
  userIdSchema,
} from "../dataTypes/zod";

const eventRoutes = express.Router();

eventRoutes.get(
  "/",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN", "USER"),
  validateQuery(searchEventSchema),
  getEventController
);
eventRoutes.get(
  "/organizedevent/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  validateParams(userIdSchema),
  getOrganizedEventcontroller
);
eventRoutes.post(
  "/postevent",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ORGANIZER", "ADMIN"),
  upload.single("coverImage"),
  validateBody(createEventSchema),
  postEventController
);

eventRoutes.get(
  "/:status",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  validateParams(statusSchema),
  getEventByStatusController
);

eventRoutes.patch(
  "/update/event/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  validateParams(eventIdSchema),
  validateBody(updateEventSchema),
  updateEventController
);

eventRoutes.patch(
  "/update/status",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  validateBody(updateEventStatusSchema),
  updateEventStatusController
);
eventRoutes.post(
  "/postimage/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER "),
  validateParams(eventIdSchema),
  upload.array("images", 5),
  postEventImagesController
);

eventRoutes.delete(
  "/delete/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  validateParams(eventIdSchema),
  deleteEventController
);
eventRoutes.delete(
  "/delete/image/:eventImageId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  validateParams(eventImageIdSchema),
  deleteEventImagesController
);

export default eventRoutes;
