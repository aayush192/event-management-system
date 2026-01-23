import { NextFunction, Request, Response } from "express";
import {
  deleteProfileImageServices,
  deleteUserServices,
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
  searchEventType,
  updateData,
  updateProfile,
  uploadProfile,
  UserType,
} from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";
import multer from "multer";

//get user by id
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) throw new apiError(401, "user data missing");
    const getUserById = await getUserByIdServices(id as string);
    if (!getUserById) throw new apiError(404, "user data missing");

    return res.status(200).json({
      success: true,
      message: `user data retrived successfully`,
      data: getUserById,
    });
  }
);

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;

    const getUser = await getUserServices(Number(page), Number(offset));

    if (!getUser) throw new apiError(404, "user data not available");

    return res.status(200).json({
      success: true,
      message: `user data retrived successfully`,
      data: getUser,
    });
  }
);

export const getRegisteredUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 15;

    if (!req.user) throw new apiError(401, `user data not available`);
    const user = req.user;
    const getRegisteredUser = await getRegisteredUserServices(
      eventId as string,
      user,
      page,
      offset
    );
    if (!getRegisteredUser) throw new apiError(404, `user not available`);

    res.status(200).json({
      success: true,
      message: "registered user retrived successfully",
      data: getRegisteredUser,
    });
  }
);

//delete user controller
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.user) throw new apiError(401, `user data missing`);
    if (!id) throw new apiError(401, `id not available`);
    const user = req.user;
    const deleteUser = await deleteUserServices(id as string, user);
    if (!deleteUser) throw new apiError(500, `problem while deleting user`);

    const { password, ...userData } = deleteUser;
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: userData,
    });
  }
);

//update user controller
export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userdata: updateData = req.body;
    if (!req.user) throw new apiError(401, `user credintials not available`);
    const user: UserType = req.user;
    const updateUser = await updateUserServices(user, userdata);
    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: updateUser,
    });
  }
);

export const setProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: uploadProfile = req.body;
    if (!req.file) throw new apiError(401, `image not uploaded`);
    const file: Express.Multer.File = req.file;
    if (!req.user) throw new apiError(401, `user data missing`);
    const user: UserType = req.user;
    console.log(user);

    const setProfile = await setProfileServices(data, file, user);

    res.status(201).json({
      success: true,
      message: "created profile successfully",
      data: setProfile,
    });
  }
);
export const updateProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) throw new apiError(401, `image not uploaded`);
    const file: Express.Multer.File = req.file;
    if (!req.user) throw new apiError(401, `user data missing`);
    const user: UserType = req.user;
    console.log(user);

    const updateProfileImage = await updateProfileImageServices(file, user);

    res.status(201).json({
      success: true,
      message: "updated profile successfully",
      data: updateProfileImage,
    });
  }
);
export const deleteProfileImageController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new apiError(401, `user data missing`);
    const user: UserType = req.user;

    const deleteProfileImage = await deleteProfileImageServices(user);

    res.status(201).json({
      success: true,
      message: "deleted profile successfully",
      data: deleteProfileImage,
    });
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateProfile = req.body;
    if (!req.user) throw new apiError(401, `user data missing`);
    const user = req.user;
    const updateProfile = await updateProfileServices(data, user);
    res.status(200).json({
      success: true,
      message: `profile updated successfully`,
      data: updateProfile,
    });
  }
);
