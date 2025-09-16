import { Request, Response } from "express";
import { processEventWithAI } from "../services/ai.service";
import { Event } from "../models/event.model"; // Asegúrate de que este modelo exista

export class EventsController {
  public async receiveEvent(req: Request, res: Response): Promise<Response> {
    try {
      const eventData: Event = req.body; // Paso 1: Validar que el evento tenga el formato correcto

      if (!eventData.eventType || !eventData.data) {
        return res.status(400).json({ message: "Missing eventType or data." });
      } // Paso 2: Pasar el evento a la función de procesamiento de IA

      const aiResponse = await processEventWithAI(eventData); // Paso 3: Responder con la respuesta de la IA

      // en events.controller.ts
      console.log(
        `[${req.correlationId}] Evento recibido: ${eventData.eventType}`
      );

      return res.status(200).json(aiResponse);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error.", error });
    }
  }
}
