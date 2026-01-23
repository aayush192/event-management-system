import { Request, Response } from "express";
import {
  getRegisteredEventServices,
  userRegistrationServices,
  userUnregistrationServices,
} from "../services/registration.Services";
import { asyncHandler } from "../utils/asyncHandler";
import apiError from "../utils/apiError";
export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    console.log(eventId);
    if (!req.user) throw new apiError(401, "user data missing");
    const user = req.user;
    if (!eventId) throw new apiError(400, "eventId missing");

    const userRegistration = await userRegistrationServices(
      user,
      eventId as string
    );
    if (!userRegistration) throw new apiError(500, "Internal server error");

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      data: userRegistration,
    });
  }
);

//user Unregistration

export const userUnregistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!req.user) throw new apiError(401, "user data missing");
    if (!eventId) throw new apiError(400, "eventId missing");
    const user = req.user;

    const userUnregistration = await userUnregistrationServices(
      user,
      eventId as string
    );
    if (!userUnregistration) throw new apiError(404, "user data missing");

    return res.status(200).json({
      success: true,
      message: "registration removed from event",
      data: userUnregistration,
    });
  }
);

//events that a user has registered

export const getRegisteredEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    if (!req.user) throw new apiError(401, `user data missing`);
    const user = req.user;
    const getRegisteredEvent = await getRegisteredEventServices(
      userId as string,
      user,
      Number(page),
      Number(offset)
    );

    if (!getRegisteredEvent)
      throw new apiError(404, `can't retrived registered event`);
    if (getRegisteredEvent.length === 0)
      throw new apiError(404, `user hasn't registered in any event`);
    return res.status(200).json({
      success: true,
      message: "registered event retrived successfully",
      data: getRegisteredEvent,
    });
  }
);
