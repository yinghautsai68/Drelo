import type { Request, Response } from "express";
import { db } from "../config/db";

export const getListWithCards = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.query(
            `SELECT 
                l.id AS list_id  ,
                l.position AS list_position,
                l.label AS list_label,
                l.color AS list_color,
                c.id AS card_id,
                c.position AS card_position,
                c.due_date AS card_due_date,
                c.label AS card_label,
                c.status AS card_status,
                c.color AS card_color
            FROM lists l 
            LEFT JOIN cards c 
            ON c.list_id = l.id 
            WHERE  user_id = 1 
            `
        );

        const listsMap: any = {};

        rows.forEach((row: any) => {
            if (!listsMap[row.list_id]) {
                listsMap[row.list_id] = {
                    id: row.list_id,
                    position: row.list_position,
                    label: row.list_label,
                    color: row.list_color,
                    cards: []
                };
            }

            if (row.card_id) {
                listsMap[row.list_id].cards.push({
                    id: row.card_id,
                    position: row.card_position,
                    due_date: row.card_due_date,
                    label: row.card_label,
                    status: row.card_status,
                    color: row.card_color
                });
            }
        });

        const data = Object.values(listsMap);
        res.status(200).json({ success: true, message: "Successfully fetched cards", data: data })
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