import { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { authRequired } from '../middlewares/auth.middleware';

export const config: ApiRouteConfig = {
  name: 'SaveKeys',
  type: 'api',
  path: '/settings/keys',
  method: 'POST',
  description: 'Saves user API keys to the backend session state',
  middleware: [authRequired],
  emits: [],
  flows: ['time-traveller-flow'],
  bodySchema: z.object({
    geminiKey: z.string().optional(),
    mapsKey: z.string().optional(),
  }),
  responseSchema: {
    // @ts-expect-error
    200: z.object({
      success: z.boolean(),
    }),
    // @ts-expect-error
    401: z.object({ error: z.string() }),
  }
};

export const handler: Handlers['SaveKeys'] = async (req, { logger, state, traceId }) => {
  const userId = req.userId;
  if (!userId) {
    return {
      status: 401,
      body: { error: 'Unauthorized' }
    };
  }

  const { geminiKey, mapsKey } = req.body;

  logger.info('Saving user API keys to state', { traceId, userId });

  if (geminiKey !== undefined) {
    await state.set(`user-keys-gemini-${userId}`, 'key', geminiKey);
  }
  
  if (mapsKey !== undefined) {
    await state.set(`user-keys-maps-${userId}`, 'key', mapsKey);
  }

  return {
    status: 200,
    body: { success: true }
  };
};
