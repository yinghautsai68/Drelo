import type { Request, Response } from "express";
import { db } from "../config/db";
import type { ListCardsType } from "../types/listscards.types";

export const getListsWithCards = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
        const [idResult]: any = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [userId]
        )
        if (idResult.length === 0) {
            return res.status(400).json({ message: "User does not exits!" });
        }

        const [rows]: any = await db.query(
            `SELECT  
                l.id AS list_id,
                l.user_id AS list_user_id,
                l.position AS list_position,
                l.label AS list_label,
                l.color AS list_color,
                c.id AS card_id,
                c.list_id AS card_list_id,
                c.position AS card_position,
                c.label AS card_label,
                c.color AS card_color,
                c.status AS card_status,
                c.due_date AS card_due_date
            FROM lists l 
            LEFT JOIN cards c ON l.id = c.list_id 
            WHERE l.user_id = ? ORDER BY l.position ASC, c.position ASC;`,
            [userId]
        )

        const listsMap: Record<number, ListCardsType> = {};

        rows.forEach((list: any) => {
            if (!listsMap[list.list_id]) {
                listsMap[list.list_id] = {
                    id: list.list_id,
                    user_id: list.list_user_id,
                    position: list.list_position,
                    label: list.list_label,
                    color: list.list_color,
                    cards: []
                }

            }
            if (list.card_id) {
                listsMap[list.list_id]!.cards.push({
                    id: list.card_id,
                    list_id: list.list_id,
                    position: list.card_position,
                    label: list.card_label,
                    color: list.card_color,
                    status: list.card_status,
                    due_date: list.card_due_date
                })
            }

        }
        )

        const listsWithCards = Object.values(listsMap).sort(
            (a: ListCardsType, b: ListCardsType) => a.position - b.position
        )

        res.status(200).json({ success: true, message: "Successfully fetched cards", data: listsWithCards })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const updateListCard = async (req: Request, res: Response) => {
    try {
        const { lists } = req.body;
        const formatDate = (date: string | null) => {
            if (!date) {
                return null;
            }

            return date.slice(0, 19).replace("T", " ");
        }

        for (const list of lists) {
            await db.query(
                "UPDATE lists SET label = ? , color = ? , position = ? WHERE id =? AND user_id = 1",
                [list.label, list.color, list.position, list.id]
            );
            for (const card of list.cards) {
                await db.query(
                    "UPDATE cards SET list_id = ? , label = ? , status = ?, color = ?,  due_date = ? , position = ?  WHERE id = ? ",
                    [list.id, card.label, card.status, card.color, formatDate(card.due_date), card.position, card.id]
                );
            }
        }

        res.status(200).json({ success: true, message: "Updated successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}