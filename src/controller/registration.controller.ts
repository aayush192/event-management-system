import { Request, Response } from "express";
import {
  getRegisteredEventServices,
  userRegistrationServices,
  deleteUserRegistrationServices,
} from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";
import apiError from "../utils/apiError.utils";
import { resHandler } from "../utils/responseHandler.utils";
export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params;

    const userRegistration = await userRegistrationServices(
      req.user!,
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

    const userUnregistration = await deleteUserRegistrationServices(
      req.user!,
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
    const getRegisteredEvent = await getRegisteredEventServices(
      userId as string,
      req.user!,
      Number(page),
      Number(offset)
    );

    return resHandler(
      res,
      200,
      true,
      "get registered event successfully",
      getRegisteredEvent
    );
  }
);
