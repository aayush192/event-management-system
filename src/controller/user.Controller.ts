import { NextFunction, Request, Response } from "express";
import {
  deleteProfileImageServices,
  deleteUserServices,
  getMeServices,
  getRegisteredUserServices,
  getUserByIdServices,
  getUserServices,
  setProfileServices,
  updateProfileImageServices,
  updateProfileServices,
  updateUserServices,
} from "../services/user.Services";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProfileType,
  updateProfileType,
  updateUserType,
  userSchema,
  userType,
} from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";
import multer from "multer";
import { resHandler } from "../utils/responseHandler";

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
    const getUser = await getUserServices(Number(page), Number(offset));

    return resHandler(res, 200, true, "user retrived successfully", getUser);
  }
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const getOwnData = await getMeServices(req.user!);

    return resHandler(res, 200, true, "retrived own data successfully", getOwnData);
  }
);

export const getRegisteredUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 15;

    const user = req.user!;
    const getRegisteredUser = await getRegisteredUserServices(
      eventId as string,
      user,
      page,
      offset
    );

    return resHandler(
      res,
      200,
      true,
      "user retrived successfully",
      getRegisteredUser
    );
  }
);

//delete user controller
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = req.user!;
    const deleteUser = await deleteUserServices(userId as string, user);

    return resHandler(res, 204, true, "user deleted successfully");
  }
);

//update user controller
export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userdata: updateUserType = req.body;
    const user = req.user!;
    const updateUser = await updateUserServices(user, userdata);
    return resHandler(res, 200, true, "user updated successfully");
  }
);

export const createProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: createProfileType = req.body;
    if (!req.file) throw new apiError(401, `image not uploaded`);
    const file: Express.Multer.File = req.file;

    const user = req.user!;
    console.log(user);

    const setProfile = await setProfileServices(data, file, user);

    return resHandler(
      res,
      201,
      true,
      "created profile succcessfully",
      setProfile
    );
  }
);
export const updateProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) throw new apiError(401, `image not uploaded`);
   const file: Express.Multer.File = req.file;
    const user = req.user!;

    const updateProfileImage = await updateProfileImageServices(file, user);

    return resHandler(res, 200, true, "updated profile image successfully");
  }
);
export const deleteProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const deleteProfileImage = await deleteProfileImageServices(user);

    return resHandler(res, 204, true, "deleted profile image successfully");
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateProfileType = req.body;
    const user = req.user!;
    const updateProfile = await updateProfileServices(data, user);
    return resHandler(res,200,true,"profile updated successfully",updateProfile)
  }
);
