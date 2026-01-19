import { getRegisteredEventServices, userRegistrationServices, userUnregistrationServices, } from "../services/registration.Services";
import { asyncHandler } from "../utils/asyncHandler";
export const userRegistrationController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    console.log(eventId);
    if (!req.user)
        return res
            .status(400)
            .json({ success: false, message: "user data missing" });
    const user = req.user;
    if (!eventId)
        return res
            .status(400)
            .json({ success: false, message: "eventId missing" });
    const userRegistration = await userRegistrationServices(user, eventId);
    if (!userRegistration)
        return res
            .status(500)
            .json({ success: false, message: "can't register user" });
    return res.status(201).json({
        success: true,
        message: "user registered successfully",
        data: userRegistration,
    });
});
//user Unregistration
export const userUnregistrationController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    if (!req.user)
        return res.status(400).json({
            success: false,
            message: `user data is not available`,
        });
    if (!eventId)
        return res.status(400).json({
            success: false,
            message: ` eventId is not available`,
        });
    const user = req.user;
    const userUnregistration = await userUnregistrationServices(user, eventId);
    if (!userUnregistration)
        return res
            .status(401)
            .json({ success: false, message: `error while deleting registration` });
    return res.status(200).json({
        success: true,
        message: "registration removed from event",
        data: userUnregistration,
    });
});
//events that a user has registered
export const getRegisteredEventController = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    if (!req.user)
        throw new Error(`can't access user data`);
    const user = req.user;
    const getRegisteredEvent = await getRegisteredEventServices(userId, user, Number(page), Number(offset));
    if (!getRegisteredEvent)
        throw new Error(`can't retrived registered event`);
    if (getRegisteredEvent.length === 0)
        throw new Error(`user hasn't registered in any event`);
    return res.status(200).json({
        success: true,
        message: "registered event retrived successfully",
        data: getRegisteredEvent,
    });
});
