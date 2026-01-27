import { Request, Response } from "express";
import {
  getRegisteredEventServices,
  userRegistrationServices,
  deleteUserRegistrationServices,
} from "../services/registration.Services";
import { asyncHandler } from "../utils/asyncHandler";
import apiError from "../utils/apiError";
import { resHandler } from "../utils/responseHandler";
export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const user = req.user!;

    const userRegistration = await userRegistrationServices(
      user,
      eventId as string
    );

    return resHandler(
      res,
      201,
      true,
      "user registered successfully",
      userRegistration
    );
  }
);

//user Unregistration

export const deleteUserRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const user = req.user!;

    const userUnregistration = await deleteUserRegistrationServices(
      user,
      eventId as string
    );

    return resHandler(res, 204, true, "user registration deleted successfully");
  }
);

//events that a user has registered

export const getRegisteredEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    const user = req.user!;
    const getRegisteredEvent = await getRegisteredEventServices(
      userId as string,
      user,
      Number(page),
      Number(offset)
    );

    if (getRegisteredEvent.length === 0)
      throw new apiError(404, `user hasn't registered in any event`);
    return resHandler(
      res,
      200,
      true,
      "get registered event successfully",
      getRegisteredEvent
    );
  }
);
