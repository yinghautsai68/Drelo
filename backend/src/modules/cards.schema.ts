import { z } from "zod";

export const cardSchema = z.object({
    list_id: z.string(),
    position: z.string(),

    due_date: z.string(),
    label: z.string(),
    status: z.string(),
    color: z.string(),
})