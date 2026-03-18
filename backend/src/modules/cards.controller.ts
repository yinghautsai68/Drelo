import type { Request, Response } from "express";
import { cardIdParamSchema, createCardSchema, editCardSchema, getCardsSchema } from "./cards.schema";
import { db } from "../config/db";

export const createCard = async (req: Request, res: Response) => {
    const result = createCardSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { list_id, position, due_date, label, status, color } = result.data;
        const [list]: any = await db.query(
            "SELECT id FROM lists WHERE id = ?",
            [list_id]
        );
        if (list.length === 0) {
            return res.status(404).json({ message: "List not found!" });
        }

        await db.query(
            "INSERT INTO cards (list_id, position, due_date, label, status, color) VALUES (?,?,?,?,?,?)",
            [list_id, position, due_date, label, status, color]
        );

        res.status(201).json({ message: "Card created successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}


export const getCards = async (req: Request, res: Response) => {
    const result = getCardsSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { list_id } = result.data;
        const [list]: any = await db.query(
            "SELECT id FROM lists WHERE id = ?",
            [list_id]
        );
        if (list.length === 0) {
            return res.status(404).json({ message: "List not found!" });
        }

        const [rows]: any = await db.query(
            "SELECT * FROM cards WHERE list_id = ? ",
            [list_id]
        );

        res.status(201).json({ message: "Get cards successfully", date: rows });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const editCard = async (req: Request, res: Response) => {
    const result = cardIdParamSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    const result2 = editCardSchema.safeParse(req.body);
    if (!result2.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { id } = result.data;
        const { list_id, position, due_date, label, status, color } = result2.data;

        const [card]: any = await db.query(
            "SELECT id FROM cards WHERE id =?",
            [id]
        );
        if (card.length === 0) {
            return res.status(404).json({ message: "Card not found!" });
        }

        await db.query(
            "UPDATE cards SET list_id = ?, position =?, due_date = ?, label =?, status = ?, color=? WHERE id = ?",
            [list_id, position, due_date, label, status, color, id]
        );
        res.status(200).json({ message: "Edited card successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}


export const deleteCard = async (req: Request, res: Response) => {
    const result = cardIdParamSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { id } = result.data;


        const [card]: any = await db.query(
            "SELECT id FROM cards WHERE id =?",
            [id]
        );
        if (card.length === 0) {
            return res.status(404).json({ message: "Card not found!" });
        }

        await db.query(
            "DELETE FROM cards WHERE id = ?",
            [id]
        );
        res.status(200).json({ message: "Deleted card successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}
