export const resHandler = async (res, statusCode, success, message, data = null, meta) => {
    return res.status(statusCode).json({ success, message, data, meta });
};
