import { prisma } from "../lib/prisma";
import { UserType } from "../dataTypes/eventdataTypes";
//user registration
export const userRegistrationServices = async (user: UserType, id: number) => {
  if (!user && !id) throw new Error("userId or EventId missing");
  if (isNaN(id)) throw new Error("EventId is not a number");
  try {
    const checkEventStatus = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (checkEventStatus?.status !== "APPROVED") {
      throw new Error(`Event is not approved`);
    }
    const userRegistration = await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: id,
      },
    });
    console.log(userRegistration);
    return userRegistration;
  } catch (error) {
    throw new Error(`error:${error}`);
  }
};

//user unregistration
export const userUnregistrationServices = async (
  user: UserType,
  id: number
) => {
  if (!user && !id) throw new Error("userId or EventId missing");
  try {
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
  } catch (error) {
    throw new Error(`${error}`);
  }
};
