import { prisma } from "../lib/prisma";
import apiError from "../utils/apiError";
import {
  Data,
  Status,
  updateEventData,
  UserType,
  searchEventType,
} from "../dataTypes/dataTypes";

export const getEventServices = async (
  page: number,
  offset: number,
  SearchValue: searchEventType,
  user: UserType
) => {
  const skip = (page - 1) * offset;

  const filters: any[] = [];
  if (SearchValue.name) {
    filters.push({
      name: { contains: SearchValue.name, mode: "insensitive" },
    });
  }

  if (SearchValue.category) {
    filters.push({
      category: SearchValue.category,
    });
  }

  if (SearchValue.eventdate) {
    filters.push({
      eventdate: new Date(SearchValue.eventdate),
    });
  }

  if (user.role !== "admin")
    filters.push({
      status: "APPROVED",
    });
  console.log(filters[0]);
  if (filters.length !== 0) {
    const searchEvent = await prisma.event.findMany({
      skip,
      take: offset,
      where: {
        AND: filters,
      },
    });
    if (!searchEvent) throw new apiError(502, "can't get event");
    return searchEvent;
  }
  const searchEvent = await prisma.event.findMany({
    skip,
    take: offset,
  });
  if (!searchEvent) throw new apiError(502, "can't get event");
  return searchEvent;
};

export const postEventServices = async (data: Data, userId: string) => {
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
};

//update event status
export const updateEventStatus = async (data: updateEventData) => {
  const updateEvent = await prisma.event.update({
    where: {
      id: data.id,
    },
    data: {
      status: data.status,
    },
  });
  return updateEvent;
};

//delete event
export const deleteEventServices = async (id: string, user: UserType) => {
  if (user.role === "ORGANIZER") {
    const checkEvent = await prisma.event.findFirst({
      where: {
        id: id,
      },
    });
    if (!checkEvent) throw new apiError(400, `doesn't have given event`);
    if (user.id !== checkEvent?.userId)
      throw new Error(`this event is not organized by ${user.name}`);
  }
  const deleteEvent = await prisma.event.delete({
    where: {
      id: id,
    },
  });
  return deleteEvent;
};

//getEventByStatus
export const getEventByStatusServices = async (
  status: Status,
  page: number,
  offset: number
) => {
  const skip = (page - 1) * offset;
  const getEventByStatus = await prisma.event.findMany({
    skip,
    take: offset,
    where: {
      status: status,
    },
  });

  if (getEventByStatus.length === 0) {
    throw new apiError(400, `event of this status not available`);
  }
  return getEventByStatus;
};

//approved events for user
export const getApprovedEventServices = async (
  page: number,
  offset: number
) => {
  try {
    const skip = (page - 1) * offset;
    const getApprovedEvent = await prisma.event.findMany({
      skip,
      take: offset,
      where: {
        status: "APPROVED",
      },
    });

    if (getApprovedEvent.length === 0) {
      throw new Error(`event of this status not available`);
    }
    return getApprovedEvent;
  } catch (error) {
    throw new Error(`internal server error: ${error}`);
  }
};

//organized Event
export const getOrganizedEventServices = async (
  user: UserType,
  userId: string
) => {
  if (user.role === "ORGANIZER" && userId !== user.id)
    throw new apiError(401, `can't retrive the events`);
  const getOrganizedEvent = await prisma.event.findMany({
    where: {
      userId: userId,
    },
  });
  if (!getOrganizedEvent) throw new Error(`error while retriving event`);
  else if (getOrganizedEvent.length === 0)
    throw new apiError(400, `doesn't have any organized event`);

  return getOrganizedEvent;
};
