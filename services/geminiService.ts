
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationConfig } from "../types";

const API_KEY = process.env.API_KEY;

export const analyzeWebPhysics = async (config: SimulationConfig) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY! });
  
  const prompt = `
    Analyze the following web-shooter parameters for a fictional high-tech device:
    - Fluid Type: ${config.fluidType}
    - Injection Pressure: ${config.pressure} PSI
    - Nozzle Diameter: ${config.nozzleDiameter} µm
    - Initial Viscosity: ${config.viscosity} cP
    - Operating Temp: ${config.temperature}°C

    The mechanism relies on pressure-induced phase transition (adiabatic cooling and shear-stress solidification) through a microscopic aperture.
    
    Calculate (fictional but scientifically plausible) the ejection velocity (m/s), solidification percentage upon air contact, and estimated tensile strength (GPa). 
    Provide a brief technical explanation of the results and suggest improvements.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            velocity: { type: Type.NUMBER },
            solidificationRate: { type: Type.NUMBER },
            tensileStrength: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            chemicalStructure: { type: Type.STRING, description: "Markdown text describing the molecular chain" }
          },
          required: ["velocity", "solidificationRate", "tensileStrength", "explanation"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
