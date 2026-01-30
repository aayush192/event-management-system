import { prisma } from "../config/prisma";
import fs from "fs/promises";
import apiError from "../utils/apiError";
import {
  createEventType,
  filterEventType,
  searchEventType,
  statusType,
  updateEventStatusType,
  updateEventType,
  userType,
} from "../schemas";
import {
  cloudianryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
  cloudinaryGetImage,
} from "../utils/cloudinary";
import { pagination } from "../utils/pagination";

//filter Event
export const filterEventServices = async (
  page: number,
  pageSize: number,
  SearchValue: filterEventType,
  user: userType
) => {
  const { currentPage, skip, take } = pagination(page, pageSize);

  const [searchEvent, totalEvent] = await prisma.$transaction([
    prisma.event.findMany({
      skip,
      take,
      where: {
        ...SearchValue,
      },
      include: {
        eventImage: true,
      },
    }),
    prisma.event.count({
      where: {
        ...SearchValue,
        status: "APPROVED",
      },
    }),
  ]);

  if (searchEvent.length === 0) throw new apiError(404, "failed get event");

  const eventWithImage = searchEvent.map((event) => {
    return {
      ...event,
      coverImageUrl: cloudinaryGetImage(event.publicId),
      eventImage: event.eventImage.map((image) => {
        return { ...image, imageUrl: cloudinaryGetImage(image.publicId) };
      }),
    };
  });

  const totalPage = totalEvent / take;

  return {
    event: eventWithImage,
    meta: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPrevious: currentPage > 1,
    },
  };
};

//search event
export const searchEvent = async (
  page: number,
  pageSize: number,
  searchValue: searchEventType,
  user: userType
) => {
  const { currentPage, skip, take } = pagination(page, pageSize);

  const [searchEvent, totalEvent] = await prisma.$transaction([
    prisma.event.findMany({
      skip,
      take,
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          { description: { contains: searchValue, mode: "insensitive" } },
        ],
      },
      include: {
        eventImage: true,
      },
    }),
    prisma.event.count({
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          { description: { contains: searchValue, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  if (searchEvent.length === 0) throw new apiError(404, "failed get event");

  const eventWithImage = searchEvent.map((event) => {
    return {
      ...event,
      coverImageUrl: cloudinaryGetImage(event.publicId),
      eventImage: event.eventImage.map((image) => {
        return { ...image, imageUrl: cloudinaryGetImage(image.publicId) };
      }),
    };
  });

  const totalPage = totalEvent / take;

  return {
    event: eventWithImage,
    meta: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPrevious: currentPage > 1,
    },
  };
};

//post event
export const postEventServices = async (
  data: createEventType,
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
      publicId: uploadCoverImage.public_id,
      userId: userId,
    },
  });

  if (!event) {
    await cloudinaryRemoveImage(uploadCoverImage.public_id);
    throw new apiError(500, "failed to add event");
  }
  return event;
};

//update event status
export const updateEventStatus = async (data: updateEventStatusType) => {
  const updateEvent = await prisma.event.update({
    where: {
      id: data.id,
    },
    data: {
      status: data.status,
    },
  });

  if (!updateEvent) throw new apiError(500, "failed to update event status");
  return updateEvent;
};

//delete event
export const deleteEventServices = async (id: string, user: userType) => {
  const checkEvent = await prisma.event.findFirst({
    where: {
      id: id,
    },
  });
  if (!checkEvent) throw new apiError(400, `event not found`);
  if (user.role === "ORGANIZER") {
    if (user.id !== checkEvent?.userId) throw new apiError(401, `unauthorized`);
  }
  await cloudinaryRemoveImage(checkEvent.publicId);

  const getImagePublicKey = await prisma.eventImage.findMany({
    select: {
      publicId: true,
    },
    where: {
      eventId: id,
    },
  });
  if (getImagePublicKey.length !== 0) {
    await cloudinaryRemoveMultipleImage(
      getImagePublicKey as [{ publicId: string }]
    );
  }
  const deleteEvent = await prisma.event.delete({
    where: {
      id: id,
    },
  });
  throw new apiError(500, "failed to delete event");

  return deleteEvent;
};

//update event
export const updateEventServices = async (
  eventId: string,
  data: updateEventType,
  user: userType
) => {
  const checkEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });
  if (!checkEvent) throw new apiError(404, "event not found");
  if (checkEvent.userId !== user.id) throw new apiError(401, "unauthorized");
  const updateEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data,
  });
  if (!updateEvent) throw new apiError(500, "failed to update event");
  return updateEvent;
};

//getEventByStatus
export const getEventByStatusServices = async (
  status: statusType,
  page: number,
  pageSize: number
) => {
  const { currentPage, skip, take } = pagination(page, pageSize);
  const [EventByStatus, totalEvent] = await prisma.$transaction([
    prisma.event.findMany({
      skip,
      take,
      where: {
        status: status,
      },
      include: {
        eventImage: true,
      },
    }),
    prisma.event.count({
      where: {
        status,
      },
    }),
  ]);
  if (EventByStatus.length === 0)
    throw new apiError(400, `event of this status not available`);
  const eventWithImage = EventByStatus.map((event) => {
    return {
      ...event,
      coverImageUrl: cloudinaryGetImage(event.publicId),
      eventImage: event.eventImage.map((image) => {
        return { ...image, imageUrl: cloudinaryGetImage(image.publicId) };
      }),
    };
  });

  const totalPage = totalEvent / take;
  return {
    event: eventWithImage,
    meta: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPrevious: currentPage > 1,
    },
  };
};

//get All Event
export const getAllEventServices = async (page: number, pageSize: number) => {
  const { currentPage, skip, take } = pagination(page, pageSize);
  const [approvedEvent, totalEvent] = await prisma.$transaction([
    prisma.event.findMany({
      skip,
      take,
      include: {
        eventImage: true,
      },
    }),
    prisma.event.count(),
  ]);
  if (approvedEvent.length === 0)
    throw new apiError(404, `event not available`);

  const eventWithImage = approvedEvent.map((event) => {
    return {
      ...event,
      coverImageUrl: cloudinaryGetImage(event.publicId),
      eventImage: event.eventImage.map((image) => {
        return { ...image, imageUrl: cloudinaryGetImage(image.publicId) };
      }),
    };
  });
  const totalPage = totalEvent / take;
  return {
    event: eventWithImage,
    meta: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPrevious: currentPage > 1,
    },
  };
};

//organized Event
export const getOrganizedEventServices = async (
  user: userType,
  userId: string,
  page: number,
  pageSize: number
) => {
  if (user.role === "ORGANIZER" && userId !== user.id)
    throw new apiError(403, `can't retrive the events`);

  const { currentPage, skip, take } = pagination(page, pageSize);

  const [organizedEvent, totalEvent] = await prisma.$transaction([
    prisma.event.findMany({
      where: {
        userId: userId,
      },
      skip,
      take,
      include: {
        eventImage: true,
      },
    }),
    prisma.event.count(),
  ]);
  if (organizedEvent.length === 0)
    throw new apiError(400, `doesn't have any organized event`);

  const eventWithImage = organizedEvent.map((event) => {
    return {
      ...event,
      coverImageUrl: cloudinaryGetImage(event.publicId),
      eventImage: event.eventImage.map((image) => {
        return { ...image, imageUrl: cloudinaryGetImage(image.publicId) };
      }),
    };
  });
  const totalPage = totalEvent / pageSize;
  return {
    event: eventWithImage,
    meta: {
      page: currentPage,
      pageSize: take,
      totalCount: totalEvent,
      totalPage,
      hasNext: currentPage < totalPage,
      hasPrevious: currentPage > 1,
    },
  };
};

//postEventImage
export const postEventImageServices = async (
  user: userType,
  file: Express.Multer.File[],
  eventId: string
) => {
  //if (!file.path) throw new apiError(400, "image path is not provided");
  const eventData = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });
  if (!eventData) throw new apiError(400, "event not available");
  if (eventData.userId !== user.id) throw new apiError(401, "unauthorized");

  const filePath = file.map((filepath) => filepath.path);

  const cloudinaryUploadImages = await Promise.all(
    filePath.map((path) => {
      return cloudianryUploadImage(path);
    })
  );
  const imageData = cloudinaryUploadImages.map((image) => ({
    publicId: image.public_id,
    eventId: eventId,
  }));
  const uploadImage = await prisma.eventImage.createMany({
    data: imageData,
  });
  if (!uploadImage) {
    for (const image of imageData) {
      await cloudinaryRemoveImage(image.publicId);
    }
    throw new apiError(500, "failed to add event image");
  }
  return uploadImage;
};

//delete Event Image
export const deleteEventImagesServices = async (
  eventImageId: string,
  user: userType
) => {
  const checkEventImage = await prisma.eventImage.findUnique({
    where: {
      id: eventImageId,
    },
  });

  if (!checkEventImage)
    throw new apiError(400, "image having this id doesn't exist");

  const checkEventOrganizer = await prisma.event.findUnique({
    where: {
      id: checkEventImage?.eventId,
    },
  });
  if (checkEventOrganizer?.userId !== user.id)
    throw new apiError(401, "unauthorized");
  await cloudinaryRemoveImage(checkEventImage.publicId);

  const deleteImage = await prisma.eventImage.delete({
    where: {
      id: eventImageId,
    },
  });
  if (!deleteImage) throw new apiError(500, "failed to delete image");

  return deleteImage;
};
