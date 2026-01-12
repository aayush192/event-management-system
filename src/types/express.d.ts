// src/types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        role: "ADMIN" | "ORGANIZER" | "USER";
      };
    }
  }
}
