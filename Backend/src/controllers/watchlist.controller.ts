import { Request, Response } from "express";
import { WatchlistService } from "../services/watchlist.service";

const watchlistService = new WatchlistService();

export class WatchlistController {
  public async createWatchlist(req: Request, res: Response): Promise<Response> {
    try {
      const { name, terms } = req.body;

      // Validación simple
      if (!name || !terms) {
        return res
          .status(400)
          .json({ message: "Nombre y términos son requeridos." });
      }

      const newWatchlist = await watchlistService.createWatchlist(name, terms);
      return res.status(201).json(newWatchlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  }
}
