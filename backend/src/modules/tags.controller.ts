import type { Request, Response } from "express";
import { db } from "../config/db";
import { createTagSchema } from "./tags.schema";


export const createTag = async (req: Request, res: Response) => {
    const result = createTagSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error });
    }
    try {
        const { user_id, color, label } = result.data;

        const [insertResult]: any = await db.query(
            "INSERT INTO tags (user_id, color, label) VALUES (?,?,?)",
            [user_id, color, label]
        )
        if (insertResult.affectedRows !== 1) {
            return res.status(400).json({ message: "Failed to create tag." })
        }
        const newTag = { id: insertResult.insertId, user_id, color, label }
        res.status(201).json({ success: true, message: "Tag created", data: newTag });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const getTags = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    try {
        const [tags]: any = await db.query(
            "SELECT * FROM tags WHERE is_default = TRUE OR user_id = 1"
        );
        res.status(200).json({ success: true, message: "Fetched tags successfully", data: tags })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const editTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { label, color } = req.body;
        await db.query(
            `
            UPDATE tags SET 
            label = COALESCE (?, label),
            color = COALESCE (?, color)
            WHERE id = ?
            `,
            [label, color, id]
        )

        res.status(200).json({ success: true, message: "Edit tag successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
}

export const deleteTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        await db.query("DELETE FROM tags WHERE id=?", [id]);

        res.status(200).json({ success: true, message: "Successfully deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
}
