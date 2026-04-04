import type { Request, Response } from "express";
import { createListSchema, editListSchema, getListsSchema, listIdParamSchema } from "./lists.schema";
import { db } from "../config/db";
import { success } from "zod";

//BASIC CRUD
export const createList = async (req: Request, res: Response) => {
    const result = createListSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error })
    }
    try {
        const { label } = result.data;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const [user]: any = await db.query(
            "SELECT id FROM users WHERE id = ? ",
            [userId]
        );
        if (user.length === 0) {
            return res.status(404).json({ message: "User does not exists!" });
        }
        const [listCount]: any = await db.query(
            "SELECT COUNT(*) AS total_lists FROM lists WHERE user_id = ?",
            [userId]
        )
        const position = listCount[0].total_lists;

        const [insertList]: any = await db.query(
            "INSERT INTO lists (user_id, position, label) VALUES (?,?,?) ",
            [userId, position, label]
        );

        const [newList]: any = await db.query(
            "SELECT * FROM lists WHERE id = ?",
            [insertList.insertId]
        );

        res.status(201).json({ success: true, message: "List created successfully!", data: newList[0] });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const getLists = async (req: Request, res: Response) => {
    const result = getListsSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: result.error })
    }
    try {
        const { user_id } = result.data;
        const [rows]: any = await db.query(
            "SELECT * FROM lists WHERE user_id = ? ORDER BY position ASC",
            [user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "User does not exists!" });
        }

        res.status(200).json({ success: true, message: "lists fetched", data: rows })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}

export const editList = async (req: Request, res: Response) => {
    const idResult = listIdParamSchema.safeParse(req.params);
    if (!idResult.success) {
        return res.status(400).json({ message: idResult.error });
    }
    const result = editListSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error });
    }
    try {
        const { id } = idResult.data;
        const userId = req.user?.id;
        const { position, label, color } = result.data;

        const [editResult]: any = await db.query(
            `
            UPDATE lists SET
            position = COALESCE(?, position),
            label = COALESCE(?, label),
            color = COALESCE(?,color)
            WHERE id = ? AND user_id = ?
            `,
            [position, label, color, id, userId]
        );
        if (editResult.affectedRows === 0) {
            return res.status(403).json({ success: false, message: "Cannot edit this list" });
        }

        res.status(200).json({ success: true, message: "Edit list successfully" });
    } catch (error) {
        console.log(error);
    }
}

export const moveList = async (req: Request, res: Response) => {
    const { lists } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized!" });
    }
    try {
        for (const list of lists) {
            const [result]: any = await db.query(
                "UPDATE lists SET position = ? WHERE id = ? AND user_id = ?",
                [list.position, list.id, userId]
            )

            if (result.affectedRows === 0) {
                return res.status(403).json({ success: false, message: "Unauthorized to move list " })
            }
        }

        res.status(200).json({ success: true, message: "Edited list successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
}



export const deleteList = async (req: Request, res: Response) => {
    const result = listIdParamSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ error: result.error })
    }
    try {
        const { id } = result.data;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const [rows]: any = await db.query(
            "SELECT id FROM lists WHERE id = ? AND user_id = ?",
            [id, userId]
        )
        if (rows.length === 0) {
            return res.status(403).json({ message: "Unauthorized to delete this list " });
        }



        await db.query(
            "DELETE FROM card_tags WHERE card_id IN (SELECT id from cards WHERE list_id = ?)",
            [id]
        );
        await db.query(
            "DELETE FROM cards WHERE list_id = ?",
            [id]
        );
        await db.query(
            "DELETE FROM lists where id = ?",
            [id]
        );

        res.status(200).json({ success: true, message: `List ${id} deleted!` })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
} 
