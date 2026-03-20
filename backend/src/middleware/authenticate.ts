import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: { id: number };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const payload: any = jwt.verify(token, env.JWT_SECRET)
        req.user = { id: payload.id };

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token!" })
    }
}
