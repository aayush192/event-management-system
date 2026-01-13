import { Request, Response } from "express";
import {
  deleteEventServices,
  postEventServices,
  updateEventStatus,
} from "../services/event.Services";
import { Data, updateEventData, UserType } from "../dataTypes/eventdataTypes";

export const postEventController = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `error has occurred: ${error}` });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `internal server error ${error}` });
  }
};

//delete event

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: `unauthorized user` });
    const deleteEvent = await deleteEventServices(Number(id), user);

    if (!deleteEvent)
      res
        .status(500)
        .json({ success: false, message: `error while deleting event` });
    res.status(200).json({
      success: true,
      message: `event deleted successfully`,
      data: deleteEvent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `internal server error :${error}` });
  }
};
