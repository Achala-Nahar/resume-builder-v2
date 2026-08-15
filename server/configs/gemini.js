import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default gemini;
