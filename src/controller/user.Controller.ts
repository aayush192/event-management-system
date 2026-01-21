import { NextFunction, Request, Response } from "express";
import {
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
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      res.status(400).json({
        success: false,
        message: "id not provided",
      });
    const getUserById = await getUserByIdServices(id as string);
    if (!getUserById)
      return res.status(404).json({
        success: false,
        message: `can't find user data`,
      });
    return res.status(200).json({
      success: true,
      message: `user data retrived successfully`,
      data: getUserById,
    });
  }
);

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page;
    const offset = req.query.offset;

    const getUser = await getUserServices(Number(page), Number(offset));
    if (!getUser)
      return res.status(404).json({
        success: false,
        message: `can't find user data`,
      });
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

    if (!req.user) throw new Error(`user data is missing`);
    const user = req.user;
    const getRegisteredUser = await getRegisteredUserServices(
      eventId as string,
      user,
      page,
      offset
    );
    if (!getRegisteredUser) throw new Error(`user not available`);
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
    if (!req.user) throw new Error(`user data not available`);
    if (!id) throw new Error(`id not available`);
    const user = req.user;
    const deleteUser = await deleteUserServices(id as string, user);
    if (!deleteUser) throw new Error(`problem while deleting user`);

    const { password, ...userData } = deleteUser;
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: userData,
    });
  }
);

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
    if (!req.file) throw new apiError(400, `image not uploaded`);
    const file: Express.Multer.File = req.file;
    if (!req.user) throw new apiError(400, `user credientals not available`);
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
    if (!req.file) throw new apiError(400, `image not uploaded`);
    const file: Express.Multer.File = req.file;
    if (!req.user) throw new apiError(400, `user credientals not available`);
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

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateProfile = req.body;
    if (!req.user) throw new apiError(404, `user credientials are not available`);
    const user = req.user;
    const updateProfile = await updateProfileServices(data, user);
    res.status(200).json({success:true,message:`profile updated successfully`,data:updateProfile})
  }
);
