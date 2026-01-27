import fs from "fs/promises";
import { prisma } from "../lib/prisma";
import {
  createProfileType,
  updateProfileType,
  updateUserType,
  userType,
} from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";
import { checkRoleUtility } from "../utils/roleCheck";
import { ProfileUncheckedCreateInput } from "../../generated/prisma/models";
import {
  cloudianryUploadImage,
  cloudinaryRemoveImage,
} from "../utils/cloudinary";

export const getMeServices = async (user: userType) => {
  const getUserData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      registrations: true,
      profile: true,
    },
    omit: {
      password: true,
    },
  });

  return getUserData;
};

//get user by id
export const getUserByIdServices = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      registrations: { include: { event: true } },
      profile: true,
    },
  });
  if (!user) throw new apiError(404, "user havig this id not found");

  const { password, ...userData } = user;
  return userData;
};

export const getUserServices = async (page: number, offset: number) => {
  const skip = (page - 1) * offset;
  const user = await prisma.user.findMany({
    skip: skip,
    take: offset,
  });
  if (!user) throw new apiError(404, "user data not found");
  console.log(user);
  const userData = user.map(({ password, ...rest }) => rest);
  console.log(JSON.stringify(userData));
  return userData;
};

export const getRegisteredUserServices = async (
  eventId: string,
  user: userType,
  page: number,
  offset: number
) => {
  try {
    if (user.role === "ORGANIZER") {
      const checkEvent = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });
      if (!checkEvent) throw new Error(`event is not available`);
      else if (checkEvent.userId !== user.id) {
        throw new Error(`event is not organized by ${user.name}`);
      }
    }
    if (!eventId) throw new Error(`eventId is missing`);
    const skip = (page - 1) * offset;
    const getRegisteredUser = await prisma.registration.findMany({
      skip: skip,
      take: offset,
      where: {
        eventId: eventId,
      },
      include: {
        user: true,
      },
    });

    return getRegisteredUser;
  } catch (error) {
    throw new Error(` ${error}`);
  }
};

//delete User
export const deleteUserServices = async (id: string, user: userType) => {
  try {
    if (id !== user.id && user.role !== "ADMIN")
      throw new Error(`user is not allowed to delete this account`);

    const checkUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!checkUser) throw new Error(`user doesn't exist`);

    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
    });
    console.log(deleteUser);
    return deleteUser;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const updateUserServices = async (
  user: userType,
  data: updateUserType
) => {
  if (!user.id) throw new apiError(401, "user credientals missing");

  if (!data.name && !data.email && !data.roleId)
    throw new apiError(400, "required data missing");
  if (data.roleId !== undefined) {
    const checkRole = await checkRoleUtility(data.roleId);
    if (checkRole.role === "admin")
      throw new apiError(403, "admin role is not allowed to choose");
  }
  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data,
  });
  if (!updateUser) throw new apiError(500, "can't update the user");
  return updateUser;
};

export const setProfileServices = async (
  data: createProfileType,
  file: Express.Multer.File,
  user: userType
) => {
  data.dob = new Date(data.dob);
  console.log("uploading started...");
  if (file.path) {
    const cloudinaryUpload = await cloudianryUploadImage(file.path);
    console.log("upload completed");
    console.log("cloudinary", cloudinaryUpload);

    const setProfile = await prisma.profile.create({
      data: {
        ...data,
        profileImgUrl: cloudinaryUpload.secure_url,
        publicId: cloudinaryUpload.public_id,
        userId: user.id,
      },
    });

    if (!setProfile)
      throw new apiError(500, `error during uploading profile data`);

    fs.unlink(file.path);

    return setProfile;
  }
};

export const updateProfileImageServices = async (
  file: Express.Multer.File,
  user: userType
) => {
  console.log();

  if (!file) throw new apiError(400, "file path missing");
  const profileData = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!profileData)
    throw new apiError(400, "profile of this user doesnot exist");

  if (!profileData.profileImgUrl || !profileData.publicId)
    throw new apiError(400, "profile  doesnot exist");

  const cloudinaryRemove = await cloudinaryRemoveImage(profileData.publicId);
  console.log(cloudinaryRemove);

  const cloudinaryUpload = await cloudianryUploadImage(file.path);
  console.log(cloudinaryUpload);

  const updateImage = await prisma.profile.update({
    where: {
      userId: user.id,
    },
    data: {
      profileImgUrl: cloudinaryUpload.secure_url,
      publicId: cloudinaryUpload.public_id,
    },
  });

  if (!updateImage) throw new apiError(500, "error while updating data");

  fs.unlink(file.path);
  return updateImage;
};

export const deleteProfileImageServices = async (user: userType) => {
  const checkProfile = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!checkProfile?.publicId) throw new apiError(404, "profile not found");

  const cloudinaryDelete = await cloudinaryRemoveImage(checkProfile.publicId);

  const deleteProfile = await prisma.profile.update({
    where: {
      userId: user.id,
    },
    data: {
      profileImgUrl: null,
      publicId: null,
    },
  });

  if (!deleteProfile) throw new apiError(500, "error while deleting image");
  return deleteProfile;
};

export const updateProfileServices = async (
  data: updateProfileType,
  user: userType
) => {
  if (!data.description && !data.dob && !data.phoneNo)
    throw new apiError(400, "data is missing");
  if (data.dob) {
    data.dob = new Date(data.dob);
  }
  const updateProfile = await prisma.profile.update({
    where: {
      userId: user.id,
    },
    data,
  });
  if (!updateProfile) throw new apiError(500, "error while updating profile");
  return updateProfile;
};
