// src/types/express.d.ts
import { Request } from "express";

declare namespace Express {
  export interface Request {
    correlationId?: string;
  }
}
