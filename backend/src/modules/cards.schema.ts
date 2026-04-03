import { z } from "zod";

export const cardSchema = z.object({
    id: z.number(),
    list_id: z.number(),
    position: z.number(),
    due_date: z.string().nullable(),
    label: z.string(),
    status: z.string(),
    color: z.string().nullable()
})

export const createCardSchema = z.object({
    list_id: z.number(),
    label: z.string(),
})

export const getCardsSchema = z.object({
    list_id: z.coerce.number()
});

export const cardIdParamSchema = z.object({
    id: z.coerce.number()
})

export const editCardSchema = z.object({
    list_id: z.number().optional(),
    position: z.number().optional(),
    due_date: z.string().optional().nullable(),
    label: z.string().optional(),
    status: z.string().optional(),
    color: z.string().optional().nullable(),
})