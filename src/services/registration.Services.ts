import { prisma } from "../lib/prisma";
import { userType } from "../dataTypes/dataTypes";
import apiError from "../utils/apiError";
//user registration
export const userRegistrationServices = async (user: userType, id: string) => {
  const checkEventStatus = await prisma.event.findUnique({
    where: {
      id: id,
    },
  });

  if (checkEventStatus?.status !== "APPROVED") {
    throw new apiError(401, `Event is not approved`);
  }
  const userRegistration = await prisma.registration.create({
    data: {
      userId: user.id,
      eventId: id,
    },
  });
  console.log(userRegistration);
  return userRegistration;
};

//user unregistration
export const deleteUserRegistrationServices = async (
  user: userType,
  id: string
) => {
  const deleteUserRegistration = await prisma.registration.delete({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: id,
      },
    },
  });
  if (!deleteUserRegistration)
    throw new apiError(500, "failed to delete user registration");
  return deleteUserRegistration;
};

//get event registered
export const getRegisteredEventServices = async (
  userId: string,
  user: userType,
  page: number,
  offset: number
) => {
  if (user.role !== "ADMIN" && user.id !== userId)
    throw new apiError(401, `user is not allowed`);

  const skip = (page - 1) * offset;
  const getRegisteredEvent = await prisma.registration.findMany({
    skip,
    take: offset,
    where: {
      userId: userId,
    },
    include: { event: true },
  });
  if (!getRegisteredEvent)
    throw new apiError(500, "failed to get registered event");
  return getRegisteredEvent;
};
