import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { checkRoleUtility } from "../utils/roleCheck";

interface userData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const verifyTokenMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authheader = req.headers.authorization;
  try {
    if (!authheader || !authheader.startsWith("Bearer")) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    const token = authheader.split(" ")[1];
    if (!token) throw new Error("token not available");

    if (!config.JWT_SECRET) throw new Error("jwt error");
    const data = jwt.verify(token, config.JWT_SECRET) as userData;

    req.user = data;

    next();
  } catch (error) {
    res.status(400).json({ success: false, message: `${error}` });
  }
};
