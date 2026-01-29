import { Request, Response } from "express";
import {
  deleteEventServices,
  getApprovedEventServices,
  getEventServices,
  getEventByStatusServices,
  getOrganizedEventServices,
  postEventServices,
  updateEventStatus,
  postEventImageServices,
  deleteEventImagesServices,
  updateEventServices,
} from "../services/event.Services";
import apiError from "../utils/apiError";
import {
  updateEventStatusType,
  status,
  searchEventType,
  updateEventType,
  createEventType,
} from "../dataTypes/zod";
import { asyncHandler } from "../utils/asyncHandler";
import { resHandler } from "../utils/responseHandler";

//get event
export const getEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchValue = {
      name: req.query?.name,
      category: req.query?.category
        ? String(req.query.category).toUpperCase()
        : undefined,
      eventdate: req.query?.eventdate
        ? new Date(String(req.query.eventdate))
        : undefined,
    };
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;

    const searchEvent = await getEventServices(
      Number(page),
      Number(offset),
      searchValue as searchEventType,
      req.user!
    );
    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      searchEvent
    );
  }
);

export const postEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: createEventType = req.body;
    const userId = req.user!.id;
    if (!req.file) throw new apiError(400, "cover image missing");

    const file = req.file;
    const event = await postEventServices(data, file, userId);

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
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const upperCaseStatus = Array.isArray(status)
      ? () => {
          throw new apiError(400, `got array of status`);
        }
      : status.toUpperCase();
    const getEventByStatus = await getEventByStatusServices(
      upperCaseStatus as status,
      Number(page),
      Number(offset)
    );
    resHandler(res, 200, true, "event retrived successfully", getEventByStatus);
  }
);

//get approved event
export const getApprovedEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const getApprovedEvent = await getApprovedEventServices(
      Number(page),
      Number(offset)
    );
    return resHandler(res, 200, true, "event retrived successfully");
  }
);

//get organized event
export const getOrganizedEventcontroller = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const getOrganizedEvent = await getOrganizedEventServices(
      req.user!,
      userId as string
    );
    return resHandler(
      res,
      200,
      true,
      "event retrived successfully",
      getOrganizedEvent
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
