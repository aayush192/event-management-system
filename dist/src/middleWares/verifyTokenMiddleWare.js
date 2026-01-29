import jwt from "jsonwebtoken";
import config from "../config/config";
;
export const verifyTokenMiddleWare = async (req, res, next) => {
    const authheader = await req.headers.authorization;
    try {
        if (!authheader || !authheader.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: "unauthorized" });
        }
        const token = authheader.split(" ")[1];
        if (!token)
            throw new Error("token not available");
        if (!config.JWT_SECRET)
            throw new Error("jwt error");
        const data = jwt.verify(token, config.JWT_SECRET);
        // console.log(data);
        req.user = data;
        next();
    }
    catch (error) {
        res.status(400).json({ success: false, message: "jwt token invalid" });
    }
};
