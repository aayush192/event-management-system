import { prisma } from "../lib/prisma";
import { UserType } from "../dataTypes/eventdataTypes";
import apiError from "../utils/apiError";
//user registration
export const userRegistrationServices = async (user: UserType, id: string) => {
  if (!user && !id) throw new Error("userId or EventId missing");

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
export const userUnregistrationServices = async (
  user: UserType,
  id: string
) => {
  if (!user && !id) throw new apiError(400, "userId or EventId missing");

  const userUnregistration = await prisma.registration.delete({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: id,
      },
    },
  });
  console.log(userUnregistration);
  return userUnregistration;
};

//get event registered
export const getRegisteredEventServices = async (
  userId: string,
  user: UserType,
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
  console.log(getRegisteredEvent);
  return getRegisteredEvent;
};
