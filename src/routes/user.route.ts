import express from "express";
import {
  deleteUserController,
  getRegisteredUserController,
  getUserByIdController,
  getUserController,
  setProfileController,
  updateProfileController,
  updateProfileImageController,
  updateUserController,
} from "../controller/user.Controller";
import { verifyTokenMiddleWare } from "../middleWares/verifyTokenMiddleWare";
import { verifyAllowedRoleMiddleWare } from "../middleWares/verifyAllowedRole";
import { updateUserServices } from "../services/user.Services";
import { upload } from "../middleWares/multer";
const userRoutes = express.Router();

userRoutes.get(
  "/user",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserController
);
userRoutes.get(
  "/user/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN"),
  getUserByIdController
);

userRoutes.get(
  "/user/registered/:eventId",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER"),
  getRegisteredUserController
);
userRoutes.delete(
  "/user/delete/:id",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  deleteUserController
);
userRoutes.patch(
  "/user/update",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  updateUserController
);

userRoutes.post(
  "/user/profile",
  verifyTokenMiddleWare,
  verifyAllowedRoleMiddleWare("ADMIN", "ORGANIZER", "USER"),
  upload.single("image"),
  setProfileController
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
  updateProfileController
);
export default userRoutes;
