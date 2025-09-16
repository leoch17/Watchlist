export interface Event {
  id: string;
  timestamp: Date;
  content: string;
  summary: string;
  severity: "LOW" | "MED" | "HIGH" | "CRITICAL";
  suggestedAction: string;
  relatedWatchlistId?: string; // Opcional, si el evento coincide con una watchlist
  matchedTerm?: string; // El término que coincidió
  eventType: string; // O el tipo de dato que uses para el evento
  data: any; // O una interfaz más específica para los datos del evento
}
