import { deleteUserServices, getRegisteredUserServices, getUserByIdServices, getUserServices, } from "../services/user.Services";
import { asyncHandler } from "../utils/asyncHandler";
export const getUserByIdController = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        res.status(400).json({
            success: false,
            message: "id not provided",
        });
    const getUserById = await getUserByIdServices(id);
    if (!getUserById)
        return res.status(404).json({
            success: false,
            message: `can't find user data`,
        });
    return res.status(200).json({
        success: true,
        message: `user data retrived successfully`,
        data: getUserById,
    });
});
export const getUserController = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const offset = req.query.offset;
    const getUser = await getUserServices(Number(page), Number(offset));
    if (!getUser)
        return res.status(404).json({
            success: false,
            message: `can't find user data`,
        });
    return res.status(200).json({
        success: true,
        message: `user data retrived successfully`,
        data: getUser,
    });
});
export const getRegisteredUserController = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 15;
    if (!req.user)
        throw new Error(`user data is missing`);
    const user = req.user;
    const getRegisteredUser = await getRegisteredUserServices(eventId, user, page, offset);
    if (!getRegisteredUser)
        throw new Error(`user not available`);
    res.status(200).json({
        success: true,
        message: "registered user retrived successfully",
        data: getRegisteredUser,
    });
});
//delete user controller
export const deleteUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.user)
        throw new Error(`user data not available`);
    if (!id)
        throw new Error(`id not available`);
    const user = req.user;
    const deleteUser = await deleteUserServices(id, user);
    if (!deleteUser)
        throw new Error(`problem while deleting user`);
    const { password, ...userData } = deleteUser;
    res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: userData,
    });
});
