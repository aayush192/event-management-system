import { NextFunction, Request, Response } from "express";
import {
  deleteProfileImageServices,
  deleteUserServices,
  getMeServices,
  getRegisteredUserServices,
  getUserByIdServices,
  getUserServices,
  updateProfileImageServices,
  updateProfileServices,
  updateUserServices,
} from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";
import {
  updateProfileType,
  updateUserType,
  userSchema,
  userType,
} from "../schemas";
import apiError from "../utils/apiError.utils";
import multer from "multer";
import { resHandler } from "../utils/responseHandler.utils";

//get user by id
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const getUserById = await getUserByIdServices(userId as string);

    return resHandler(
      res,
      200,
      true,
      "user retrived successfully",
      getUserById
    );
  }
);

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;
    const { data, meta } = await getUserServices(Number(page), Number(offset));

    return resHandler(res, 200, true, "user retrived successfully", data, meta);
  }
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getMeServices(req.user!);

    return resHandler(res, 200, true, "retrived own data successfully", user);
  }
);

export const getRegisteredUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 15;

    const { data, meta } = await getRegisteredUserServices(
      eventId as string,
      req.user!,
      page,
      offset
    );

    return resHandler(res, 200, true, "user retrived successfully", data, meta);
  }
);

//delete user controller
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const deleteUser = await deleteUserServices(userId as string, req.user!);

    return resHandler(res, 204, true, "user deleted successfully");
  }
);

//update user controller
export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userdata: updateUserType = req.body;
    const updateUser = await updateUserServices(req.user!, userdata);
    return resHandler(res, 200, true, "user updated successfully");
  }
);

export const updateProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) throw new apiError(401, `image not uploaded`);
    const file: Express.Multer.File = req.file;

    const updateProfileImage = await updateProfileImageServices(
      file,
      req.user!
    );

    return resHandler(res, 200, true, "updated profile image successfully");
  }
);
export const deleteProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const deleteProfileImage = await deleteProfileImageServices(req.user!);

    return resHandler(res, 204, true, "deleted profile image successfully");
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateProfileType = req.body;
    const updateProfile = await updateProfileServices(data, req.user!);
    return resHandler(
      res,
      200,
      true,
      "profile updated successfully",
      updateProfile
    );
  }
);
