import { Modality } from "@google/genai";
import { getAI } from './imageService';

export async function synthesizeSpeech(text: string, language: string = 'en'): Promise<string> {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: language === 'zh' ? 'Aoife' : 'Fenrir' // Assuming Aoife might be better for multi-lang or just Fenrir
            }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    return base64Audio;
  } catch (error) {
    throw error;
  }
}

