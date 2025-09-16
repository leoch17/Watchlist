import OpenAI from "openai";
import { Event } from "../models/event.model";

// Inicializa el cliente de OpenAI con tu clave de entorno.
// Asegúrate de que el archivo .env tenga la variable OPENAI_API_KEY.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define la estructura que la IA debe devolver.
interface AIResponse {
  summary: string;
  severity: "LOW" | "MED" | "HIGH" | "CRITICAL";
  suggestedAction: string;
}

export const processEventWithAI = async (event: Event): Promise<AIResponse> => {
  // Define la lógica de IA con un prompt estructurado.
  const prompt = `
 Eres un analista de seguridad. Analiza el siguiente evento y genera un resumen, una severidad (LOW, MED, HIGH, CRITICAL) y una acción sugerida. Proporciona la respuesta en formato JSON.

  Evento:
  ${JSON.stringify(event)}

  Ejemplo de respuesta JSON:
  {
     "summary": "Resumen del evento",
     "severity": "SEVERIDAD",
     "suggestedAction": "Acción sugerida"
  `;

  try {
    // Realiza la llamada a la API de OpenAI.
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Usa gpt-4o si necesitas más precisión.
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }); // Parsea la respuesta JSON y la convierte a tu tipo de dato.

    const aiAnalysis = JSON.parse(
      response.choices[0].message.content as string
    ) as AIResponse;
    return aiAnalysis;
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error); // Devuelve una respuesta de fallback simple en caso de que la llamada a la API falle.

    return {
      summary: "Error en el análisis de IA. Procesamiento fallido.",
      severity: "LOW",
      suggestedAction: "Revisar logs del sistema de IA para más detalles.",
    };
  }
};
