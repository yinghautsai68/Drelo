import { z } from "zod";
import { cardSchema } from "./cards.schema";



export const createListSchema = z.object({
    label: z.string()
});

export const listIdParamSchema = z.object({
    id: z.coerce.number()
});

export const getListsSchema = z.object({
    user_id: z.coerce.number()
});

export const editListSchema = z.object({
    position: z.number().optional(),
    label: z.string().optional(),
    color: z.string().optional()
});

export const moveListSchema = z.object({
    position: z.number(),
    label: z.string(),
});

