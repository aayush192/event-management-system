import { deleteEventServices, getApprovedEventServices, getEventBySearchServices, getEventByStatusServices, getOrganizedEventServices, postEventServices, updateEventStatus, } from "../services/event.Services";
import { asyncHandler } from "../utils/asyncHandler";
export const postEventController = asyncHandler(async (req, res) => {
    const data = req.body;
    if (!req.user?.id)
        return res.status(400).json({ success: false, message: "unauthorized" });
    const userId = req.user.id;
    const event = await postEventServices(data, userId);
    if (!event)
        return res
            .status(500)
            .json({ success: false, message: "error while creating an event" });
    res.status(201).json({ success: true, data: event });
});
export const updateEventController = asyncHandler(async (req, res) => {
    const data = req.body;
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
});
//delete event
export const deleteEventController = asyncHandler(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (!user)
        return res
            .status(401)
            .json({ success: false, message: `unauthorized user` });
    const deleteEvent = await deleteEventServices(id, user);
    if (!deleteEvent)
        res
            .status(500)
            .json({ success: false, message: `error while deleting event` });
    res.status(200).json({
        success: true,
        message: `event deleted successfully`,
        data: deleteEvent,
    });
});
//get event by status
export const getEventByStatusController = asyncHandler(async (req, res) => {
    const { status } = req.params;
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const upperCaseStatus = status.toUpperCase();
    const getEventByStatus = await getEventByStatusServices(upperCaseStatus, Number(page), Number(offset));
    return res.status(200).json({
        success: true,
        message: "event retrived successfully",
        data: getEventByStatus,
    });
});
//get approved event
export const getApprovedEventController = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const getApprovedEvent = await getApprovedEventServices(Number(page), Number(offset));
    return res.status(200).json({
        success: true,
        message: "event retrived successfully",
        data: getApprovedEvent,
    });
});
//get organized event
export const getOrganizedEventcontroller = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!req.user)
        throw new Error(`user data not available`);
    const user = req.user;
    const getOrganizedEvent = await getOrganizedEventServices(user, userId);
    if (!getOrganizedEvent)
        throw new Error(`can't get organized events`);
    else if (getOrganizedEvent.length === 0)
        throw new Error(`doesn't have any organized events`);
    return res.status(200).json({
        success: true,
        message: `retrived organized by organizer ${userId}`,
        data: getOrganizedEvent,
    });
});
export const getEventBySearchController = asyncHandler(async (req, res) => {
    if (!req.user)
        throw new Error(`user data missing`);
    const user = req.user;
    const searchValue = {
        name: req.query?.name,
        category: req.query?.category
            ? String(req.query.category).toUpperCase()
            : undefined,
        eventdate: req.query?.eventdate,
    };
    const searchEvent = await getEventBySearchServices(searchValue, user);
    if (searchEvent.length === 0)
        throw new Error(`doesn't have any event`);
    if (!searchEvent.length)
        throw new Error(`can't get event`);
    return res.status(200).json({
        success: true,
        message: `search event retrived successfully`,
        data: searchEvent,
    });
});
