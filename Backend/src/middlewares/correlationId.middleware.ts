// src/middlewares/correlationId.middleware.ts
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headerId = req.headers["x-correlation-id"];

  const correlationId = Array.isArray(headerId)
    ? headerId[0]
    : (headerId as string) || uuidv4();

  // Asigna el ID de correlación al objeto de la solicitud
  req.correlationId = correlationId;

  // Establece el mismo encabezado en la respuesta para rastreo
  res.setHeader("x-correlation-id", correlationId);

  next();
};
