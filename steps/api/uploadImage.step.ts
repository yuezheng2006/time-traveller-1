import { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { uploadReferenceImage, isSupabaseConfigured } from '../../services/supabase/storageService';
import { authRequired } from '../middlewares/auth.middleware';

export const config: ApiRouteConfig = {
  name: 'UploadImage',
  type: 'api',
  path: '/teleport/upload',
  method: 'POST',
  description: 'Uploads a reference image to storage and returns the URL',
  middleware: [authRequired],
  emits: [],
  flows: ['time-traveller-flow'],
  bodySchema: z.object({
    image: z.string().min(1, "Image data is required"),
  }),
  responseSchema: {
    // @ts-expect-error
    201: z.object({
      url: z.string(),
    }),
    // @ts-expect-error
    400: z.object({ error: z.string() }),
    // @ts-expect-error
    401: z.object({ error: z.string() }),
    // @ts-expect-error
    500: z.object({ error: z.string() })
  }
};

export const handler: Handlers['UploadImage'] = async (req, { logger, traceId }) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return {
        status: 401,
        body: { error: 'Unauthorized' }
      };
    }

    const { image } = req.body;

    if (!isSupabaseConfigured()) {
      logger.error('UploadImage: Supabase not configured');
      return {
        status: 500,
        body: { error: 'Cloud storage not configured on server' }
      };
    }

    // Use a temporary ID for the upload if we don't have a teleportId yet
    // Or just use userId/timestamp
    const tempId = `temp-${userId}-${Date.now()}`;
    logger.info('Uploading image for user', { traceId, userId });
    
    const url = await uploadReferenceImage(tempId, image);
    
    logger.info('Image uploaded successfully', { traceId, url });

    return {
      status: 201,
      body: { url }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    logger.error('Upload failed', { traceId, error: message });
    return {
      status: 400,
      body: { error: message }
    };
  }
};
