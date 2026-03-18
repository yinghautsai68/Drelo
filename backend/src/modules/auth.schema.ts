import { z } from "zod";

export const registerSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    phone: z.string()
});

export const loginSchema = z.object({
    username: z.string(),
    password: z.string()
});