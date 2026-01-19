import { prisma } from "../lib/prisma";
import {
  Data,
  Status,
  updateEventData,
  UserType,
  searchEventType,
} from "../dataTypes/eventdataTypes";
import { checkRoleUtility } from "../utils/roleCheck";

export const postEventServices = async (data: Data, userId: string) => {
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
export const deleteEventServices = async (id: string, user: UserType) => {
  try {
    const checkRole = await checkRoleUtility(user.role);
    if (checkRole.role === "ORGANIZER") {
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
export const getEventByStatusServices = async (
  status: Status,
  page: number,
  offset: number
) => {
  try {
    const skip = (page - 1) * offset;
    const getEventByStatus = await prisma.event.findMany({
      skip,
      take: offset,
      where: {
        status: status,
      },
    });

    if (getEventByStatus.length === 0) {
      throw new Error(`event of this status not available`);
    }
    return getEventByStatus;
  } catch (error) {
    throw new Error(`internal server error: ${error}`);
  }
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
  try {
    const checkRole = await checkRoleUtility(user.role);
    if (checkRole.role === "ORGANIZER" && userId !== user.id)
      throw new Error(`can't retrie the events`);
    const getOrganizedEvent = await prisma.event.findMany({
      where: {
        userId: userId,
      },
    });
    if (!getOrganizedEvent) throw new Error(`error while retriving event`);
    else if (getOrganizedEvent.length === 0)
      throw new Error(`doesn't have any organized event`);

    return getOrganizedEvent;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

//search for events

export const getEventBySearchServices = async (
  SearchValue: searchEventType,
  user: UserType
) => {
  try {
    const filters: any[] = [];
    const checkRole = await checkRoleUtility(user.role);
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

    if (checkRole.role !== "ADMIN")
      filters.push({
        status: "APPROVED",
      });
    console.log(filters[0]);
    if (filters.length === 0)
      throw new Error(`can't search without search values`);
    const searchEvent = await prisma.event.findMany({
      where: {
        AND: filters,
      },
    });

    return searchEvent;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
