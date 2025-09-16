import client from "prom-client";

//Crear un registro de metricas
const register = new client.Registry();

//Habilitar las metricas por defecto de Node.js
client.collectDefaultMetrics({ register });

//Definir un contador para los eventos de la IA
const aiEventsProcessed = new client.Counter({
  name: "ai_events_processed_total",
  help: "Total de eventos procesados por la IA",
  labelNames: ["severity"],
});

//Definir un histograma para la latencia de las API
const requestLatencySeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de las peticiones HTTP en segundos",
  labelNames: ["route", "method", "status"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Bins para el histograma
});

// Exportar el registro y las métricas
export { aiEventsProcessed, requestLatencySeconds, register };
