import { Request, Response } from "express";
import {
  deleteEventServices,
  getApprovedEventServices,
  getEventServices,
  getEventByStatusServices,
  getOrganizedEventServices,
  postEventServices,
  updateEventStatus,
} from "../services/event.Services";
import apiError from "../utils/apiError";
import {
  Data,
  updateEventData,
  UserType,
  Status,
  searchEventType,
} from "../dataTypes/dataTypes";
import { asyncHandler } from "../utils/asyncHandler";

export const getEventController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new Error(`user data missing`);
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
    if (!req.user?.id)
      return res.status(400).json({ success: false, message: "unauthorized" });
    const userId = req.user.id;
    const event = await postEventServices(data, userId);
    if (!event)
      return res
        .status(500)
        .json({ success: false, message: "error while creating an event" });
    res.status(201).json({ success: true, data: event });
  }
);

export const updateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const data: updateEventData = req.body;
    if (!data)
      return res.status(400).json({ success: false, message: "invalid data" });
    const updateEvent = await updateEventStatus(data);
    if (!updateEvent)
      return res
        .status(500)
        .json({ success: false, message: `error during updating status` });

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
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: `unauthorized user` });
    const deleteEvent = await deleteEventServices(id as string, user);

    if (!deleteEvent)
      res
        .status(500)
        .json({ success: false, message: `error while deleting event` });
    res.status(200).json({
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
    if (!req.user) throw new Error(`user data not available`);
    const user = req.user;
    const getOrganizedEvent = await getOrganizedEventServices(
      user,
      userId as string
    );
    if (!getOrganizedEvent) throw new Error(`can't get organized events`);
    else if (getOrganizedEvent.length === 0)
      throw new Error(`doesn't have any organized events`);

    return res.status(200).json({
      success: true,
      message: `retrived organized by organizer ${userId}`,
      data: getOrganizedEvent,
    });
  }
);
