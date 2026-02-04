import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { authLoginServices, authRegisterServices, changePasswordServices, logOutServices, passwordResetMailServices, refreshAccessTokenServices, registerMailServices, resetPasswordServices, } from "../services/index.js";
import apiError from "../utils/apiError.utils.js";
import { resHandler } from "../utils/responseHandler.utils.js";
export const registerMailController = async (req, res) => {
    const data = req.body;
    const info = await registerMailServices(data);
    resHandler(res, 200, true, "sent mail successfully");
};
export const registerUserController = asyncHandler(async (req, res) => {
    const token = req.query.token;
    const data = req.body;
    if (!req.file)
        throw new apiError(400, "profile image not provided");
    const info = await authRegisterServices(data, req.file, token);
    resHandler(res, 201, true, "user registered successfully", info);
});
export const loginUserController = asyncHandler(async (req, res) => {
    const data = req.body;
    const info = await authLoginServices(data);
    return resHandler(res, 200, true, "user logged in successfully", info);
});
export const changePasswordController = asyncHandler(async (req, res) => {
    const data = req.body;
    const info = await changePasswordServices(req.user, data);
    return resHandler(res, 200, true, "password changed successfully", info);
});
export const resetPasswordEmailController = asyncHandler(async (req, res) => {
    const user = req.body;
    const info = await passwordResetMailServices(user.email);
    return resHandler(res, 200, true, "send email successfully");
});
export const resetPasswordController = asyncHandler(async (req, res) => {
    const token = req.query.token;
    const data = req.body;
    const info = await resetPasswordServices(token, data);
    return resHandler(res, 200, true, "password changed successfully", info);
});
//refresh token controller
export const refreshAccessTokenController = asyncHandler(async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
        throw new apiError(400, "missing refresh token");
    const info = await refreshAccessTokenServices(refreshToken);
    return resHandler(res, 200, true, "token refreshed successfully", info);
});
//logOut controller
export const logOutController = asyncHandler(async (req, res) => {
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer")) {
        return res.status(401).json({ success: false, message: "unauthorized" });
    }
    const token = authheader?.split(" ")[1];
    await logOutServices(token);
    resHandler(res, 200, true, "you have logged out successfully");
});
