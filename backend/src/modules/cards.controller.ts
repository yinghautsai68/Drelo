import type { Request, Response } from "express";
import { cardIdParamSchema, createCardSchema, editCardSchema, getCardsSchema } from "./cards.schema";
import { db } from "../config/db";
import { success } from "zod";
import type { ListCardsType } from "../types/listscards.types";


export const createCard = async (req: Request, res: Response) => {
    const result = createCardSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    try {
        const { list_id, label } = result.data;
        const [list]: any = await db.query(
            "SELECT id FROM lists WHERE id = ?",
            [list_id]
        );
        if (list.length === 0) {
            return res.status(404).json({ message: "List not found!" });
        }

        const [lastpos]: any = await db.query(
            "SELECT MAX(position) AS last_position FROM cards WHERE list_id = ?",
            [list_id]
        )
        const position = lastpos[0].last_position === null ? 0 : lastpos[0].last_position + 1;

        const [insertResult]: any = await db.query(
            "INSERT INTO cards (list_id, label, position) VALUES (?,?,?)",
            [list_id, label, position]
        );
        const [newCard]: any = await db.query(
            "SELECT * FROM cards WHERE id = ?",
            [insertResult.insertId]
        );

        res.status(201).json({ success: true, message: "Card created successfully!", data: newCard[0] });

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
        return res.status(400).json({ message: result.error });
    }
    const result2 = editCardSchema.safeParse(req.body);
    if (!result2.success) {
        return res.status(400).json({ message: result2.error });
    }

    const formatDate = (date?: string | null) => {
        if (!date) {
            return null;
        }
        return date.slice(0, 19).replace("T", " ");
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
            `UPDATE cards SET 
            list_id = COALESCE(?, list_id), 
            position = COALESCE(?, position), 
            due_date = COALESCE(?, due_date), label = COALESCE(?,label), 
            status = COALESCE(?,status),
            color =COALESCE(?,color)  
            WHERE id = ? `
            ,
            [list_id ?? null, position ?? null, formatDate(due_date) ?? null, label ?? null, status ?? null, color ?? null, id]
        );
        res.status(200).json({ success: true, message: "Edited card successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const moveCard = async (req: Request, res: Response) => {
    try {
        const { lists } = req.body;
        if (!lists) {
            return res.status(400).json({ message: "No lists received" });
        }

        for (const list of lists) {
            for (const card of list.cards) {
                await db.query(
                    "UPDATE cards SET list_id = ?, position = ? WHERE id = ?",
                    [card.list_id, card.position, card.id]
                );
            }


        }

        res.status(200).json({ success: true, message: "Moved card successfully!" });
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
