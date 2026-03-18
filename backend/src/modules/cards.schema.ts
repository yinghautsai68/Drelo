import { z } from "zod";

export const createCardSchema = z.object({
    list_id: z.number(),
    position: z.number(),

    due_date: z.string(),
    label: z.string(),
    status: z.string(),
    color: z.string(),
})

export const getCardsSchema = z.object({
    list_id: z.coerce.number()
});

export const cardIdParamSchema = z.object({
    id: z.coerce.number()
})

export const editCardSchema = z.object({
    list_id: z.number(),
    position: z.number(),

    due_date: z.string(),
    label: z.string(),
    status: z.string(),
    color: z.string(),
})