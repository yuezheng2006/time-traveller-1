import { Type } from "@google/genai";
import { getAI } from './imageService';

export async function parseTravelCommand(
  message: string, 
  history: string[],
  language: string = 'en'
): Promise<{ 
  isJump: boolean; 
  reply: string; 
  params?: { destination: string, era: string, style: string } 
}> {
  const ai = getAI();
  // 如果language是zh，则使用中文提示词，否则使用英文提示词
  
  const prompt = `
    You are the navigation AI for Time Traveller.
    User Message: "${message}"
    
    If the user wants to travel/teleport/go somewhere, extract the destination, era, and style.
    If the era is not specified, infer a likely one or use 'Present Day'.
    If the style is not specified, default to 'Photorealistic'.

    IMPORTANT: Your "reply" MUST be in ${language === 'zh' ? 'Chinese' : 'English'}.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isJump: { type: Type.BOOLEAN, description: "True if user wants to travel/teleport." },
            reply: { type: Type.STRING, description: "A short, robotic, sci-fi confirmation message or a conversational reply if not jumping. Use the requested language." },
            destination: { type: Type.STRING },
            era: { type: Type.STRING },
            style: { type: Type.STRING, description: "One of: Photorealistic, Cyberpunk, Vintage Film, Oil Painting, Surrealist Dream, Photo Restoration, Pixar 3D Style, Photo Book, Cinematic Grid, 3x3 Grid, CCTV, Aerial Drone, Real-time Weather, Light Leak, Hyper-Realistic, Disposable Camera" },
          },
          required: ["isJump", "reply"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      isJump: result.isJump,
      reply: result.reply,
      params: result.isJump ? {
        destination: result.destination || "Unknown",
        era: result.era || "Present Day",
        style: result.style || "Photorealistic"
      } : undefined
    };

  } catch (error) {
    const errorMsg = language === 'zh' ? "指令信号中断。请重试。" : "Command signal interrupted. Please retry.";
    return { isJump: false, reply: errorMsg };
  }
}

