import { z } from 'zod';

export const createTagSchema = z.object({
    user_id: z.number(),
    color: z.string(),
    label: z.string()
});