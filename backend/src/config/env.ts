import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    JWT_SECRET: z.string()
})

export const env = envSchema.parse(process.env)