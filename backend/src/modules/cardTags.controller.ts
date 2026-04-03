import type { Request, Response } from "express";
import { db } from "../config/db";
import { addTagToCardSchema } from "./cardTags.schema";

export const addTagToCard = async (req: Request, res: Response) => {
    const result = addTagToCardSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error });
    }
    try {
        const { card_id, tag_id } = result.data;

        await db.query(
            "INSERT INTO card_tags (card_id, tag_id) VALUES (?,?)",
            [card_id, tag_id]
        );

        res.status(201).json({ success: true, message: "Tag added to card successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getCardTags = async (req: Request, res: Response) => {
    try {
        const { card_id } = req.query;

        const [tags]: any = await db.query(
            "SELECT ct.tag_id AS id, t.color, t.label FROM card_tags ct LEFT JOIN tags t ON ct.tag_id = t.id WHERE card_id =? ",
            [card_id]

        );
        if (tags.length === 0) {
            return res.status(404).json({ message: "no tags found!" });
        }

        res.status(200).json({ success: true, message: "fetched tags", data: tags });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}