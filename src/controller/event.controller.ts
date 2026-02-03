import { Request, Response } from "express";
import {
  deleteEventServices,
  getAllEventServices,
  filterEventServices,
  getEventByStatusServices,
  getOrganizedEventServices,
  postEventServices,
  updateEventStatus,
  postEventImageServices,
  deleteEventImagesServices,
  updateEventServices,
  searchEventServices,
} from "../services";
import apiError from "../utils/apiError.utils";
import {
  updateEventStatusType,
  statusType,
  searchEventType,
  updateEventType,
  createEventType,
  filterEventType,
} from "../schemas";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { resHandler } from "../utils/responseHandler.utils";
import { number, string } from "zod";

//get event
export const getEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchValue = {
      name: req.query?.name
        ? { contains: req.query.name, mode: "insensitive" }
        : undefined,
      category: req.query?.category
        ? String(req.query.category).toUpperCase()
        : undefined,
      eventdate: req.query?.eventdate
        ? new Date(String(req.query.eventdate))
        : undefined,
      location: req.query?.location
        ? { contains: req.query.location, mode: "insensitive" }
        : undefined,
    };
    console.log(searchValue.location);
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;

    const { event, meta } = await filterEventServices(
      Number(page),
      Number(offset),
      searchValue as filterEventType,
      req.user!
    );
    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      event,
      meta
    );
  }
);

export const searchEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const search = req.query.search;

    if (Array.isArray(search) || typeof search !== "string")
      throw new apiError(400, "search value can't be an array");

    const { data, meta } = await searchEventServices(
      Number(page),
      Number(offset),
      search!,
      req.user!
    );

    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      data,
      meta
    );
  }
);

export const postEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: createEventType = req.body;
    if (!req.file) throw new apiError(400, "cover image missing");

    const file = req.file;
    const event = await postEventServices(data, file, req.user!);

    return resHandler(res, 201, true, "post created Successfully", event);
  }
);

export const updateEventStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateEventStatusType = req.body;
    const updateEvent = await updateEventStatus(data);

    return resHandler(
      res,
      200,
      true,
      "status of the event is updated successfully",
      updateEvent
    );
  }
);

//delete event

export const deleteEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const deleteEvent = await deleteEventServices(eventId as string, req.user!);

    return resHandler(res, 204, true, "event deleted successfully");
  }
);

//get event by status

export const getEventByStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.params;
    const page = req.query.page||1;
    const offset = req.query.offset||10;
    const upperCaseStatus = Array.isArray(status)
      ? () => {
          throw new apiError(400, `got array of status`);
        }
      : status.toUpperCase();
    const { event, meta } = await getEventByStatusServices(
      upperCaseStatus as statusType,
      Number(page),
      Number(offset)
    );
    resHandler(res, 200, true, "event retrived successfully", event, meta);
  }
);

//get all event
export const getAllEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    const { event, meta } = await getAllEventServices(
      Number(page),
      Number(offset)
    );
    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      event,
      meta
    );
  }
);

//get organized event
export const getOrganizedEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    const { event, meta } = await getOrganizedEventServices(
      req.user!,
      userId as string,
      Number(page),
      Number(offset)
    );
    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      event,
      meta
    );
  }
);

export const postEventImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!req.files) throw new apiError(400, "filepath missing");
    const files = req.files;

    const eventImage = await postEventImageServices(
      req.user!,
      files as Express.Multer.File[],
      eventId as string
    );

    return resHandler(
      res,
      201,
      true,
      "event image added successfully",
      eventImage
    );
  }
);

//update event
export const updateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    if (Array.isArray(eventId))
      throw new apiError(400, "eventId can't be in array");
    const data = req.body;
    const updateEvent = await updateEventServices(
      eventId,
      data as updateEventType,
      req.user!
    );
    return resHandler(
      res,
      200,
      true,
      "event updated successfully",
      updateEvent
    );
  }
);

//delete event image
export const deleteEventImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventImageId } = req.params;
    if (Array.isArray(eventImageId))
      throw new apiError(400, "params shouldn't be an array");
    const deleteEventImage = await deleteEventImagesServices(
      eventImageId,
      req.user!
    );
    return resHandler(res, 204, true, "event image deleted successfully");
  }
);
