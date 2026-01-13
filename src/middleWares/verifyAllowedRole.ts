import { Request, Response, NextFunction } from "express";

type Role = "ADMIN" | "ORGANIZER" | "USER";
export const verifyAllowedRoleMiddleWare = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userdata = req.user;
      if (!userdata?.role)
        return res
          .status(400)
          .json({ success: false, message: "user role missing" });

      if (!allowedRoles.includes(userdata.role)) {
       res.status(401).json({ success: false, message: "user is not allowed" });
      }
      
       next();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: `internal server error ${err}` });
    }
  };
};
