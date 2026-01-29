import { prisma } from "../config/prisma";
import { userType } from "../dataTypes/zod";
import apiError from "../utils/apiError";
import { pagination } from "../utils/pagination";
import { number } from "zod";
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
  pageSize: number
) => {
  if (user.role !== "ADMIN" && user.id !== userId)
    throw new apiError(401, `unauthorized`);

  const { currentPage, skip, take } = pagination(page, pageSize);
  const [event, totalEvent] = await prisma.$transaction([
    prisma.registration.findMany({
      skip,
      take,
      where: {
        userId: userId,
      },
      include: { event: true },
    }),
    prisma.registration.count({
      where: {
        userId: userId,
      },
    }),
  ]);
  const totalPage = totalEvent! / take;
  if (!event) throw new apiError(500, "failed to get registered event");
  return {
    event,
    pagination: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPervious: currentPage > 1,
    },
  };
};
