// Backend/src/index.ts

import "dotenv/config";
import express from "express";
import cors from "cors";
import expressPino from "express-pino-logger";
import { PrismaClient } from "@prisma/client";

// Importaciones de tus rutas y middleware
import metricsRoutes from "./routes/metrics.routes";
import statusRoutes from "./routes/status.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import eventsRoutes from "./routes/events.routes";
import { correlationIdMiddleware } from "../src/middlewares/correlationId.middleware";
import { notFoundHandler } from "../src/middlewares/notFoundHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware"; // Importa el middleware de error

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient(); // Instancia única de PrismaClient

// Middlewares
app.use(cors());
app.use(express.json());

app.use(correlationIdMiddleware);
const logger = expressPino({
  genReqId: (req) => (req as any).correlationId,
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});
app.use(logger);

// Rutas
app.use("/metrics", metricsRoutes);
app.use("/api", statusRoutes);
app.use("/api/watchlists", watchlistRoutes);
app.use("/api/events", eventsRoutes);

// Manejo de errores 404
app.use(notFoundHandler);
// Manejador de errores global
app.use(errorHandler);

// Función principal para conectar a la base de datos e iniciar el servidor
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database!");
    app.listen(PORT, () => {
      console.log(`Backend is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Detiene la aplicación si la conexión falla
  }
}

// Inicia la función main
main();
