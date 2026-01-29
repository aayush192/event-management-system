import { Request, Response, NextFunction } from "express";

export const verifyAllowedRoleMiddleWare = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userdata = req.user;
      if (!userdata?.role)
        return res
          .status(400)
          .json({ success: false, message: "user role missing" });
      
      console.log(userdata, allowedRoles);
      
      if (!allowedRoles.includes(userdata.role.toUpperCase())) {

        return res
          .status(401)
          .json({ success: false, message: "user is not allowed" });
      }

      next();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: `internal server error ${err}` });
    }
  };
};
