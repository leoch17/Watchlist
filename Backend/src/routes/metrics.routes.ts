import { Router, Request, Response } from "express";
import { register } from "../services/metrics.service";

const router = Router();

// Endpoint para exponer las métricas de Prometheus
router.get("/", async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;
