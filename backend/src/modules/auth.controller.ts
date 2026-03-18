import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { db } from "../config/db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { username, password, email, phone } = result.data;

        // Check user exist
        const [rows]: any = await db.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );
        if (rows.length > 0) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register
        await db.query(
            "INSERT INTO users (username, password, email, phone) VALUES(?,?,?,?)",
            [username, hashedPassword, email, phone]
        )
        res.status(201).json({ message: "Registration success" });
    } catch (error) {
        console.log();
        res.status(500).json({ message: "Server error!" });
    }
}

export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { username, password } = result.data;

        const [rows]: any = await db.query(
            "SELECT id, password FROM users WHERE username = ? ",
            [username]
        );
        if (rows.length === 0) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is invalid!" });
        }

        const token = jwt.sign(
            { id: rows[0].id }, env.JWT_SECRET, { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful!", token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}