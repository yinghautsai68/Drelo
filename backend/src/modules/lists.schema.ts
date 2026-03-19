import { z } from "zod";



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
    position: z.number(),
    label: z.string(),
    color: z.string()
});

