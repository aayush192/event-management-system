import { prisma } from "../lib/prisma";
import { UserType } from "../dataTypes/eventdataTypes";
//user registration
export const userRegistrationservices = async (user: UserType, id: number) => {
  if (!user && !id) throw new Error("userId or EventId missing");
  try {
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
