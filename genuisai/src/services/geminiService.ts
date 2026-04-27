import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PythonCodeResponse {
  code: string;
  explanation: string;
  libraries: string[];
}

export async function generatePythonCode(prompt: string): Promise<PythonCodeResponse> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are PyGenius AI, a world-class Python architect.
    Your goal is to generate high-quality, efficient, and well-documented Python code based on user requests.
    
    Return your response in JSON format with the following structure:
    {
      "code": "The complete Python code block",
      "explanation": "A detailed explanation of how the code works in Markdown format",
      "libraries": ["List", "of", "required", "external", "libraries"]
    }
    
    Ensure the code is "cool" - use modern Python features (type hints, f-strings, async/await if applicable).
    If the user's request is vague, make reasonable assumptions to build something impressive.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as PythonCodeResponse;
  } catch (error) {
    console.error("Error generating Python code:", error);
    throw new Error("Failed to generate code. Please check your connection or prompt.");
  }
}
