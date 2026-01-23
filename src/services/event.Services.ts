import { prisma } from "../lib/prisma";
import fs from "fs/promises";
import apiError from "../utils/apiError";
import {
  Data,
  Status,
  updateEventData,
  UserType,
  searchEventType,
  updateEvent,
} from "../dataTypes/dataTypes";
import {
  cloudianryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} from "../utils/cloudinary";
import { deleteEventImagesController } from "../controller/event.Controller";

//get event by search
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
      include: {
        eventImage: true,
      },
    });
    if (!searchEvent) throw new apiError(502, "can't get event");
    return searchEvent;
  }
  const searchEvent = await prisma.event.findMany({
    skip,
    take: offset,
    include: {
      eventImage: true,
    },
  });
  if (!searchEvent) throw new apiError(502, "can't get event");
  return searchEvent;
};

//pst event
export const postEventServices = async (
  data: Data,
  file: Express.Multer.File,
  userId: string
) => {
  if (!file.path) throw new apiError(400, `file path not available`);
  const uploadCoverImage = await cloudianryUploadImage(file.path);

  const event = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      eventdate: new Date(data.eventdate),
      category: data.category,
      coverImageUrl: uploadCoverImage.secure_url,
      publicId: uploadCoverImage.public_id,
      userId: userId,
    },
  });

  if (!event) throw new apiError(500, "error while adding event");
  fs.unlink(file.path);
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
  const checkEvent = await prisma.event.findFirst({
    where: {
      id: id,
    },
  });
  if (!checkEvent) throw new apiError(400, `doesn't have given event`);
  if (user.role === "ORGANIZER") {
    if (user.id !== checkEvent?.userId)
      throw new Error(`this event is not organized by ${user.name}`);
  }
  const deleteCoverImage = await cloudinaryRemoveImage(checkEvent.publicId);

  const getImagePublicKey = await prisma.eventImage.findMany({
    select: {
      publicId: true,
    },
    where: {
      eventId: id,
    },
  });
  if (getImagePublicKey.length !== 0) {
    const deleteImage = await cloudinaryRemoveMultipleImage(
      getImagePublicKey as [{ publicId: string }]
    );
    if (!deleteImage)
      throw new apiError(500, "failed to delete iamge(cloudinary)");
  }
  const deleteEvent = await prisma.event.delete({
    where: {
      id: id,
    },
  });
  return deleteEvent;
};

//update event
export const updateEventServices = async (
  eventId: string,
  data: updateEvent,
  user: UserType
) => {
  const checkEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });
  if (!data.category && !data.description && !data.eventdate && !data.name)
    throw new apiError(400, "no data provided");
  if (!checkEvent) throw new apiError(404, "event not found");
  if (checkEvent.userId !== user.id)
    throw new apiError(400, "can't update others event");
  const updateEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data,
  });
  if (!updateEvent) throw new apiError(500, "error while updating event");
  return updateEvent;
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
    include: {
      eventImage: true,
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
      include: {
        eventImage: true,
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
    include: {
      eventImage: true,
    },
  });
  if (!getOrganizedEvent) throw new Error(`error while retriving event`);
  else if (getOrganizedEvent.length === 0)
    throw new apiError(400, `doesn't have any organized event`);

  return getOrganizedEvent;
};

//postEventImage
export const postEventImageServices = async (
  user: UserType,
  file: Express.Multer.File[],
  eventId: string
) => {
  //if (!file.path) throw new apiError(400, "image path is not provided");
  const eventData = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });
  if (!eventData)
    throw new apiError(400, "event having this Id is not available");
  if (eventData.userId !== user.id)
    throw new apiError(401, "can't upload image in others event");

  const filePath = file.map((filepath) => filepath.path);

  const cloudinaryUploadImages = await Promise.all(
    filePath.map((path) => {
      return cloudianryUploadImage(path);
    })
  );
  const imageData = cloudinaryUploadImages.map((image) => ({
    imageUrl: image.secure_url,
    publicId: image.public_id,
    eventId: eventId,
  }));
  const uploadImage = await prisma.eventImage.createMany({
    data: imageData,
  });

  filePath.forEach((path) => {
    fs.unlink(path);
  });
  return uploadImage;
};

export const deleteEventImagesServices = async (
  eventImageId: string,
  user: UserType
) => {
  const checkEventImage = await prisma.eventImage.findUnique({
    where: {
      id: eventImageId,
    },
  });
  console.log(eventImageId);
  if (!checkEventImage)
    throw new apiError(400, "image having this id doesn't exist");

  const checkEventOrganizer = await prisma.event.findUnique({
    where: {
      id: checkEventImage?.eventId,
    },
  });
  if (checkEventOrganizer?.userId !== user.id)
    throw new apiError(401, "can't delete others event's image");

  const cloudinaryRemove = await cloudinaryRemoveImage(
    checkEventImage.publicId
  );

  const deleteImage = await prisma.eventImage.delete({
    where: {
      id: eventImageId,
    },
  });
  if (!deleteImage)
    throw new apiError(
      500,
      "Internal server error (error while deleting image data)"
    );

  return deleteImage;
};
