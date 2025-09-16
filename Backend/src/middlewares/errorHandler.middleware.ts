// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";

// Define un tipo de error personalizado para la validación
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[${req.correlationId}] Error:`, err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Si no es un error conocido, devuelve un 500
  return res.status(500).json({
    message: "Error interno del servidor.",
  });
};
