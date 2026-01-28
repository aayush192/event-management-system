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
} from "../controller/user.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { updateUserServices } from "../services/user.Services";
import { upload } from "../middleWares/multer";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleWares/validate";
import {
  eventIdSchema,
  paginationSchema,
  updateProfileSchema,
  updateUserSchema,
  userIdSchema,
} from "../dataTypes/dataTypes";
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


userRoutes.patch(
  "/user/update/image",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  upload.single("image"),
  updateProfileImageController
);
userRoutes.patch(
  "/user/update/profile",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  validateBody(updateProfileSchema),
  updateProfileController
);
userRoutes.delete(
  "/user/delete/profileimage",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  deleteProfileImageController
);

userRoutes.delete(
  "/user/delete/:userId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  validateParams(userIdSchema),
  deleteUserController
);

export default userRoutes;
