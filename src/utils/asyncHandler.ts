import { Request, Response, NextFunction } from 'express';

interface AsyncHandlerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export const asyncHandler = (fn: AsyncHandlerFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
