// Define la estructura que la IA debe devolver
export interface AIResponse {
  summary: string;
  severity: "LOW" | "MED" | "HIGH" | "CRITICAL";
  suggestedAction: string;
}
