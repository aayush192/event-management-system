import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import apiError from "../utils/apiError.utils";
export const validateBody = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateSchema = schema.parse(req.body);
      return next();
    } catch (err) {
      throw new apiError(400, `${err}`);
    }
  };
};

export const validateParams = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateSchema = schema.parse(req.params);
      return next();
    } catch (err) {
      throw new apiError(400, `${err}`);
    }
  };
};

export const validateQuery = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateSchema = schema.parse(req.query);
      return next();
    } catch (err) {
      throw new apiError(400, `${err}`);
    }
  };
};
