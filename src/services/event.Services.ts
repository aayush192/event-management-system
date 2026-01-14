import { prisma } from "../lib/prisma";
import { Data, updateEventData, UserType } from "../dataTypes/eventdataTypes";
export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}
export const postEventServices = async (data: Data, userId: number) => {
  try {
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        eventdate: new Date(data.eventdate),
        category: data.category,
        userId: userId,
      },
    });
    return event;
  } catch (error) {
    throw new Error(`internal error : ${error}`);
  }
};

//update event status
export const updateEventStatus = async (data: updateEventData) => {
  try {
    const updateEvent = await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status,
      },
    });
    return updateEvent;
  } catch (error) {
    throw new Error(`internal error ${error}`);
  }
};

//delete event
export const deleteEventServices = async (id: number, user: UserType) => {
  try {
    if (user.role === "ORGANIZER") {
      const checkEvent = await prisma.event.findFirst({
        where: {
          id: id,
        },
      });
      if (!checkEvent) throw new Error(`doesn't have given event`);
      if (user.id !== checkEvent?.userId)
        throw new Error(`this event is not organized by ${user.name}`);
    }
    const deleteEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });
    return deleteEvent;
  } catch (error) {
    throw new Error(`internal server error: ${error}`);
  }
};



//getEventByStatus
