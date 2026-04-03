import { z } from 'zod';

export const addTagToCardSchema = z.object({
    card_id: z.number(),
    tag_id: z.number()
});