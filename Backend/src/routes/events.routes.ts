import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { processEventWithAI } from "../services/ai.service";
import { aiEventsProcessed } from "../services/metrics.service";

const prisma = new PrismaClient();
const router = Router();

// Endpoint para simular la recepcion de un nuevo evento
router.post("/simulate", async (req: Request, res: Response) => {
  // Asegúrate de que este log funcione con el middleware pino-http
  (req as any).log.info({
    message: "Starting event simulation",
    correlationId: (req as any).id,
  });
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ error: "El contenido del evento es requerido." });
    }

    const aiResult = await processEventWithAI(content);
    aiEventsProcessed.inc({ severity: aiResult.severity });

    const watchlists = await prisma.watchlist.findMany();

    let matchedWatchlistId: string | undefined;
    let matchedTerm: string | undefined;

    for (const watchlist of watchlists) {
      const foundTerm = watchlist.terms.find((term) =>
        content.toLowerCase().includes(term.toLowerCase())
      );
      if (foundTerm) {
        matchedWatchlistId = watchlist.id;
        matchedTerm = foundTerm;
        break;
      }
    }

    const newEvent = await prisma.event.create({
      data: {
        content,
        summary: aiResult.summary,
        severity: aiResult.severity,
        suggestedAction: aiResult.suggestedAction,
        relatedWatchlistId: matchedWatchlistId,
        matchedTerm: matchedTerm,
      },
    });

    (req as any).log.info({
      message: "Event processed successfully",
      correlationId: (req as any).id,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error simulating event:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    (req as any).log.error({
      message: "Error simulating event",
      error: errorMessage,
      correlationId: (req as any).id,
    });
    res.status(500).json({ error: "Error simulating event." });
  }
});

// Elimina esta línea si ya la tienes en /simulate
// router.post("/", eventsController.receiveEvent);

// Endpoint para obtener todos los eventos de la base de datos.
router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Error al obtener los eventos." });
  }
});

export default router;
