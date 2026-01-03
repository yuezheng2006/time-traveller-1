import { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { parseTravelCommand } from '../../services/gemini/commandParser';

const bodySchema = z.object({
  message: z.string().min(1),
  history: z.array(z.string()).optional().default([]),
  language: z.string().optional().default('en')
});

export const config: ApiRouteConfig = {
  name: 'ParseTravelCommand',
  type: 'api',
  path: '/parse-command',
  method: 'POST',
  description: 'Parses a natural language travel command',
  emits: [],
  flows: ['time-traveller-flow'],
  bodySchema,
  responseSchema: {
    200: z.object({
      isJump: z.boolean(),
      reply: z.string(),
      params: z.object({
        destination: z.string(),
        era: z.string(),
        style: z.string(),
        aspectRatio: z.string().optional(),
        imageSize: z.string().optional()
      }).optional()
    }),
    400: z.object({ error: z.string() })
  }
};

export const handler: Handlers['ParseTravelCommand'] = async (req, { logger, state, traceId }) => {
  try {
    const { message, history, language } = bodySchema.parse(req.body);
    
    // Fetch keys from state if available
    const userId = req.userId;
    let userGeminiKey: string | undefined;
    
    if (userId) {
      userGeminiKey = await state.get<string>(`user-keys-gemini-${userId}`, 'key') || undefined;
    }
    
    logger.info('Parsing travel command', { 
      traceId, 
      message, 
      language,
      usingUserKey: !!userGeminiKey 
    });
    
    const result = await parseTravelCommand(message, history, language, userGeminiKey);
    
    logger.info('Command parsed', { 
      traceId, 
      isJump: result.isJump,
      reply: result.reply.substring(0, 50) + (result.reply.length > 50 ? '...' : '')
    });
    
    return {
      status: 200,
      body: result
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Failed to parse command';
    logger.error('Command parsing failed', { traceId, error: errMessage });
    return {
      status: 400,
      body: { error: errMessage }
    };
  }
};

