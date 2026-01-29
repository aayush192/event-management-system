import express from "express";
import {
  deleteProfileImageController,
  deleteUserController,
  getMeController,
  getRegisteredUserController,
  getUserByIdController,
  getUserController,
  updateProfileController,
  updateProfileImageController,
  updateUserController,
} from "../controller/user.controller";
import { verifyTokenMiddleWare } from "../middlewares/auth.middleware.ts";
import { verifyAllowedRoleMiddleWare } from "../middlewares/verifyAllowedRole";
import { updateUserServices } from "../services/user.services";
import { upload } from "../middlewares/multer";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate";
import {
  eventIdSchema,
  paginationSchema,
  updateProfileSchema,
  updateUserSchema,
  userIdSchema,
} from "../dataTypes/zod";
const userRoutes = express.Router();

userRoutes.get(
  "/user",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  validateQuery(paginationSchema),
  getUserController
);
userRoutes.get(
  "/user/me",
  (req, res, next) => {
    console.log("hell");
    next();
  },
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "USER", "ORGANIZER"),
  getMeController
);

userRoutes.get(
  "/user/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  validateParams(userIdSchema),
  getUserByIdController
);
userRoutes.get(
  "/user/registered/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  validateParams(eventIdSchema),
  validateQuery(paginationSchema),
  getRegisteredUserController
);

userRoutes.patch(
  "/user/update",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  validateBody(updateUserSchema),
  updateUserController
);

userRoutes.delete(
  "/user/delete/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  validateParams(userIdSchema),
  deleteUserController
);

userRoutes.patch(
  "/user/profile/update/image",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  upload.single("image"),
  updateProfileImageController
);
userRoutes.patch(
  "/user/profile/update",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  validateBody(updateProfileSchema),
  updateProfileController
);
userRoutes.delete(
  "/user/profile/delete/image",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  deleteProfileImageController
);

export default userRoutes;
