// Backend/src/routes/watchlist.routes.ts

import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// No necesitas importar el controlador aquí si vas a manejar la lógica directamente.
// const watchlistController = new WatchlistController();

const prisma = new PrismaClient();
const router = Router();

// Endpoint para crear una nueva watchlist en la base de datos
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, terms } = req.body;
    if (!name || !terms || !Array.isArray(terms)) {
      return res.status(400).json({
        error: "Nombre y términos son requeridos y deben ser un array.",
      });
    }

    // Usa el cliente de Prisma para crear un nuevo registro en la tabla 'watchlists'
    const newWatchlist = await prisma.watchlist.create({
      data: {
        name,
        terms,
      },
    });

    res.status(201).json(newWatchlist);
  } catch (error) {
    // Manejo de errores en caso de fallo en la base de datos
    console.error("Error creating watchlist:", error);
    res.status(500).json({ error: "Error al crear la watchlist." });
  }
});

// Endpoint para obtener todas las watchlists de la base de datos
router.get("/", async (req: Request, res: Response) => {
  try {
    // Usa el cliente de Prisma para buscar todos los registros en la tabla 'watchlists'
    const watchlists = await prisma.watchlist.findMany();
    res.json(watchlists);
  } catch (error) {
    // Manejo de errores en caso de fallo en la base de datos
    console.error("Error fetching watchlists:", error);
    res.status(500).json({ error: "Error al obtener las watchlists." });
  }
});

export default router;
