import { off } from "node:cluster";
import { prisma } from "../lib/prisma";
import { updateData, UserType } from "../dataTypes/eventdataTypes";
import apiError from "../utils/apiError";
import { checkRoleUtility } from "../utils/roleCheck";
export const getUserByIdServices = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        registrations: { include: { event: true } },
      },
    });
    if (!user) return user;

    const { password, ...userData } = user;
    return userData;
  } catch (error) {
    throw new Error(`error occurred ${error}`);
  }
};

export const getUserServices = async (page: number, offset: number) => {
  try {
    const skip = (page - 1) * offset;
    const user = await prisma.user.findMany({
      skip: skip,
      take: offset,
    });
    if (!user) return user;
    console.log(user);
    const userData = user.map(({ password, ...rest }) => rest);
    console.log(JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw new Error(`error occurred ${error}`);
  }
};

export const getRegisteredUserServices = async (
  eventId: string,
  user: UserType,
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
export const deleteUserServices = async (id: string, user: UserType) => {
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
    });
    console.log(deleteUser);
    return deleteUser;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const updateUserServices = async (
  user: UserType,
  updatedata: updateData
) => {
  if (!user.id) throw new apiError(401, "user credientals missing");
  const data: Partial<updateData> = {};

  if (updatedata.name !== undefined) data.name = updatedata.name;
  if (updatedata.email !== undefined) data.email = updatedata.email;
  if (updatedata.roleId !== undefined) {
    const checkRole = await checkRoleUtility(updatedata.roleId);
    if (checkRole.role === "admin")
      throw new apiError(403, "admin role is not allowed to choose");

    data.roleId = updatedata.roleId;
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
