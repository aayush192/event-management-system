import { getRegisteredEventServices, userRegistrationServices, deleteUserRegistrationServices, } from "../services/index.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { resHandler } from "../utils/responseHandler.utils.js";
export const userRegistrationController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userRegistration = await userRegistrationServices(req.user, eventId);
    return resHandler(res, 201, true, "user registered successfully", userRegistration);
});
//user Unregistration
export const deleteUserRegistrationController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userUnregistration = await deleteUserRegistrationServices(req.user, eventId);
    return resHandler(res, 204, true, "user registration deleted successfully");
});
//events that a user has registered
export const getRegisteredEventController = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    const getRegisteredEvent = await getRegisteredEventServices(userId, req.user, Number(page), Number(offset));
    return resHandler(res, 200, true, "get registered event successfully", getRegisteredEvent);
});
