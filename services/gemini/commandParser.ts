import { Type } from "@google/genai";
import { getAI } from './imageService';

export async function parseTravelCommand(
  message: string, 
  history: string[],
  language: string = 'en'
): Promise<{ 
  isJump: boolean; 
  reply: string; 
  params?: { 
    destination: string, 
    era: string, 
    style: string,
    aspectRatio?: string,
    imageSize?: string
  } 
}> {
  const ai = getAI();
  
  const prompt = `
    You are the navigation AI for Time Traveller.
    User Message: "${message}"
    
    If the user wants to travel/teleport/go somewhere, extract the following parameters:
    1. destination: The place they want to go.
    2. era: The time period (e.g., "1920s", "Future", "Ancient Rome"). Default to 'Present Day' if not specified.
    3. style: The visual style. One of the allowed values below. Default to 'Photorealistic' if not specified.
    4. aspectRatio: The image aspect ratio if specified. Map terms like "wide", "landscape", "wallpaper" to '16:9', "tall", "portrait", "mobile" to '9:16', "square" to '1:1'.
    5. imageSize: The image resolution if specified ("1K", "2K", "4K"). Map "high res" or "HD" to '2K', "ultra HD" or "4K" to '4K'.

    ALLOWED STYLES:
    Photorealistic, Cyberpunk, Vintage Film, Oil Painting, Surrealist Dream, Photo Restoration, Pixar 3D Style, Photo Book, Cinematic Grid, 3x3 Grid, CCTV, Aerial Drone, Real-time Weather, Light Leak, Hyper-Realistic, Disposable Camera

    ALLOWED ASPECT RATIOS:
    1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9, 4:5, 5:4

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
            style: { type: Type.STRING },
            aspectRatio: { type: Type.STRING, description: "Normalized aspect ratio string (e.g. '9:16', '1:1')" },
            imageSize: { type: Type.STRING, description: "Normalized size string ('1K', '2K', '4K')" },
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
        style: result.style || "Photorealistic",
        aspectRatio: result.aspectRatio,
        imageSize: result.imageSize
      } : undefined
    };

  } catch (error) {
    const errorMsg = language === 'zh' ? "指令信号中断。请重试。" : "Command signal interrupted. Please retry.";
    return { isJump: false, reply: errorMsg };
  }
}

