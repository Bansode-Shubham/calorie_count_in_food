import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the food image using Gemini.
 */
export const analyzeFoodImage = async (file: File): Promise<AnalysisResult> => {
  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    Analyze this image of food. 
    Identify each distinct food item. 
    Estimate the calories and macronutrients (protein, carbs, fat in grams) for each item based on visible portion sizes.
    Provide a total summary and a short, one-sentence health tip.
    Return the result strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        imagePart,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalCalories: { type: Type.NUMBER, description: "Total estimated calories for the entire meal" },
          totalMacros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER, description: "Total protein in grams" },
              carbs: { type: Type.NUMBER, description: "Total carbohydrates in grams" },
              fat: { type: Type.NUMBER, description: "Total fat in grams" },
            },
            required: ["protein", "carbs", "fat"]
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the food item" },
                calories: { type: Type.NUMBER, description: "Calories for this specific item" },
                portionSize: { type: Type.STRING, description: "Estimated portion description (e.g., '1 cup', '150g')" },
                macros: {
                  type: Type.OBJECT,
                  properties: {
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                  },
                  required: ["protein", "carbs", "fat"]
                },
                confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
              },
              required: ["name", "calories", "portionSize", "macros", "confidence"]
            }
          },
          healthTip: { type: Type.STRING, description: "A brief, encouraging health tip related to this meal" }
        },
        required: ["totalCalories", "totalMacros", "items", "healthTip"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  try {
    const data = JSON.parse(response.text) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Failed to parse JSON response", error);
    throw new Error("Failed to parse analysis results.");
  }
};
