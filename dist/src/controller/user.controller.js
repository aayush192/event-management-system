import { deleteProfileImageServices, deleteUserServices, getMeServices, getOrganizerServices, getRegisteredUserServices, getUserByIdServices, getUserServices, updateProfileImageServices, updateProfileServices, updateUserServices, } from "../services/index.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import apiError from "../utils/apiError.utils.js";
import { resHandler } from "../utils/responseHandler.utils.js";
//get user by id
export const getUserByIdController = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const data = await getUserByIdServices(userId);
    return resHandler(res, 200, true, "user retrived successfully", data);
});
export const getUserController = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 15;
    const { data, meta } = await getUserServices(Number(page), Number(offset));
    return resHandler(res, 200, true, "user retrived successfully", data, meta);
});
export const getMeController = asyncHandler(async (req, res) => {
    const user = await getMeServices(req.user);
    return resHandler(res, 200, true, "retrived own data successfully", user);
});
export const getRegisteredUserController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 15;
    const { data, meta } = await getRegisteredUserServices(eventId, req.user, page, offset);
    return resHandler(res, 200, true, "user retrived successfully", data, meta);
});
//delete user controller
export const deleteUserController = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const deleteUser = await deleteUserServices(userId, req.user);
    return resHandler(res, 204, true, "user deleted successfully");
});
//update user controller
export const updateUserController = asyncHandler(async (req, res) => {
    const userdata = req.body;
    const updateUser = await updateUserServices(req.user, userdata);
    return resHandler(res, 200, true, "user updated successfully");
});
export const updateProfileImageController = asyncHandler(async (req, res) => {
    if (!req.file)
        throw new apiError(401, `image not uploaded`);
    const file = req.file;
    const updateProfileImage = await updateProfileImageServices(file, req.user);
    return resHandler(res, 200, true, "updated profile image successfully");
});
export const deleteProfileImageController = asyncHandler(async (req, res) => {
    const deleteProfileImage = await deleteProfileImageServices(req.user);
    return resHandler(res, 204, true, "deleted profile image successfully");
});
export const updateProfileController = asyncHandler(async (req, res) => {
    const data = req.body;
    const updateProfile = await updateProfileServices(data, req.user);
    return resHandler(res, 200, true, "profile updated successfully", updateProfile);
});
export const getOrganizerController = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 20;
    const { data, meta } = await getOrganizerServices(Number(page), Number(offset));
    resHandler(res, 200, true, "organizer retrived successfully", data, meta);
});
