import { getAI } from './imageService';

export async function generateLocationDetails(destination: string, era: string, language: string = 'en'): Promise<{description: string, mapsUri?: string}> {
  const ai = getAI();
  const prompt = `You are a virtual travel guide. 
  Find the real world location for ${destination} if it exists on Earth.
  Describe the experience of arriving at ${destination} in the ${era} era.
  Focus on sensory details: what does the user see, hear, and smell?
  Keep it immersive, evocative, and concise (under 100 words).
  IMPORTANT: Your description MUST be in ${language === 'zh' ? 'Chinese' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const description = response.text || (language === 'zh' ? "无可用描述。" : "No description available.");
    
    let mapsUri: string | undefined;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks && groundingChunks.length > 0) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          mapsUri = chunk.web.uri;
          break;
        }
        if (chunk.maps?.uri) {
          mapsUri = chunk.maps.uri;
          break;
        }
      }
    }

    return { description, mapsUri };
  } catch {
    const errorMsg = language === 'zh' ? "目的地历史数据链接损坏。仅显示视觉效果。" : "Data link to destination history corrupted. Visuals only.";
    return { description: errorMsg };
  }
}

