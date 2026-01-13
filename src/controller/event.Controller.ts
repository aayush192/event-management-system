import { Request, Response } from "express";
import { postEventServices } from "../services/event.Services";

interface Data {
  name: string;
  description: string;
  eventdate: Date;
}
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
