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
  Data,
  updateEventData,
  UserType,
  Status,
  searchEventType,
  updateEvent,
} from "../dataTypes/dataTypes";
import { asyncHandler } from "../utils/asyncHandler";

//get event
export const getEventController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new apiError(401, `user data missing`);
    const user = req.user;
    const searchValue = {
      name: req.query?.name,
      category: req.query?.category
        ? String(req.query.category).toUpperCase()
        : undefined,
      eventdate: req.query?.eventdate,
    };
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;

    const searchEvent = await getEventServices(
      Number(page),
      Number(offset),
      searchValue as searchEventType,
      user
    );
    return res.status(200).json({
      success: true,
      message: `search event retrived successfully`,
      data: searchEvent,
    });
  }
);

export const postEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: Data = req.body;
    if (!req.user?.id) throw new apiError(401, "user data missing");
    const userId = req.user.id;
    if (!req.file) throw new apiError(400, "cover image missing");

    const file = req.file;
    const event = await postEventServices(data, file, userId);
    if (!event) throw new apiError(500, "error while creating an event");
    return res.status(201).json({
      success: true,
      message: "event created successfully",
      data: event,
    });
  }
);

export const updateEventStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateEventData = req.body;
    if (!data) throw new apiError(400, "data missing");
    const updateEvent = await updateEventStatus(data);
    if (!updateEvent) throw new apiError(500, "error while updating status");

    return res.status(200).json({
      success: true,
      message: `status updated successfully`,
      data: updateEvent,
    });
  }
);

//delete event

export const deleteEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) throw new apiError(401, "user data missing");
    const deleteEvent = await deleteEventServices(id as string, user);

    if (!deleteEvent) throw new apiError(500, "error while deleting event");

    return res.status(200).json({
      success: true,
      message: `event deleted successfully`,
      data: deleteEvent,
    });
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
      upperCaseStatus as Status,
      Number(page),
      Number(offset)
    );
    return res.status(200).json({
      success: true,
      message: "event retrived successfully",
      data: getEventByStatus,
    });
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
    return res.status(200).json({
      success: true,
      message: "event retrived successfully",
      data: getApprovedEvent,
    });
  }
);

//get organized event
export const getOrganizedEventcontroller = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!req.user) throw new apiError(401, `user data missing`);
    const user = req.user;
    const getOrganizedEvent = await getOrganizedEventServices(
      user,
      userId as string
    );
    if (!getOrganizedEvent)
      throw new apiError(500, `can't get organized events`);

    if (getOrganizedEvent.length === 0)
      throw new apiError(404, `doesn't have any organized events`);

    return res.status(200).json({
      success: true,
      message: `retrived organized by organizer ${userId}`,
      data: getOrganizedEvent,
    });
  }
);

export const postEventImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) throw new apiError(400, "user data missing");
    const user = req.user;

    if (!req.files) throw new apiError(400, "filepath missing");
    const files = req.files;

    const eventImage = await postEventImageServices(
      user,
      files as Express.Multer.File[],
      eventId as string
    );

    return res.status(201).json({
      success: true,
      message: "uploaded successfully",
      data: eventImage,
    });
  }
);

//update event
export const updateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new apiError(401, "user data missing");
    const user = req.user;
    const { eventId } = req.params;
    if (Array.isArray(eventId))
      throw new apiError(400, "eventId can't be in array");
    const data = req.body;
    const updateEvent = await updateEventServices(
      eventId,
      data as updateEvent,
      user
    );
    return res.status(200).json({
      success: true,
      message: "event updated succesfully",
      data: updateEvent,
    });
  }
);

//delete event image
export const deleteEventImagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventImageId } = req.params;
    if (Array.isArray(eventImageId))
      throw new apiError(400, "params shouldn't be an array");
    console.log(eventImageId);
    if (!req.user) throw new apiError(401, "user data missing ");
    const user = req.user;
    const deleteEventImage = await deleteEventImagesServices(
      eventImageId,
      user
    );

    return res.status(200).json({
      success: false,
      message: "image deleted successfully",
      data: deleteEventImage,
    });
  }
);
