import { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { synthesizeSpeech } from '../../services/gemini/ttsService';
import { uploadAudio, isSupabaseConfigured } from '../../services/supabase/storageService';

const inputSchema = z.object({
  teleportId: z.string(),
  text: z.string(),
  language: z.string().optional().default('en')
});

export const config: EventConfig = {
  name: 'SynthesizeSpeech',
  type: 'event',
  description: 'Synthesizes speech from text using Gemini TTS',
  subscribes: ['synthesize-speech'],
  emits: ['audio-synthesized'],
  // @ts-expect-error - Zod schema compatible at runtime, TypeScript strictness issue
  input: inputSchema,
  flows: ['time-traveller-flow']
};

interface AudioState {
  audioData?: string;
  audioUrl?: string;
}

type SynthesizeSpeechInput = z.infer<typeof inputSchema>;

export const handler: Handlers['SynthesizeSpeech'] = async (input, { emit, logger, state, traceId }) => {
  const { teleportId, text, language } = input as SynthesizeSpeechInput;
  
  try {
    logger.info('Synthesizing speech', { traceId, teleportId, language });
    
    const audioData = await synthesizeSpeech(text, language);
    
    logger.info('Speech synthesized successfully', { traceId, teleportId });
    
    const audioState: AudioState = {};
    
    if (isSupabaseConfigured()) {
      try {
        logger.info('Uploading audio to Supabase', { teleportId });
        const audioUrl = await uploadAudio(teleportId, audioData);
        logger.info('Audio uploaded successfully', { teleportId, audioUrl });
        audioState.audioUrl = audioUrl;
      } catch (uploadError) {
        logger.warn('Failed to upload audio to Supabase, falling back to state storage', { 
          teleportId, 
          error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
        });
        audioState.audioData = audioData;
      }
    } else {
      audioState.audioData = audioData;
    }

    // Always store in state so CompleteTeleport can pick it up
    await state.set('teleport-audio', teleportId, audioState);
    
    // Emit that audio is ready
    await emit({
      topic: 'audio-synthesized',
      data: { teleportId }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Speech synthesis failed';
    logger.error('Speech synthesis failed', { traceId, teleportId, error: message });
  }
};

