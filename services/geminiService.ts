import { GoogleGenAI, Type } from "@google/genai";
import { AIPersonaResponse } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateUserPersona = async (name: string): Promise<AIPersonaResponse> => {
  if (!ai) {
    throw new Error("API Key not found");
  }

  // Updated prompt for Dengue Pro context
  const prompt = `Generate a formal job title for a Dengue Control Program staff member (e.g., Vector Control Specialist, Field Entomologist, Surveillance Officer) for a person named "${name}".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING, description: "Official Dengue Control job title" },
          },
          required: ["role"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as AIPersonaResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    return {
      role: "Vector Control Officer",
    };
  }
};