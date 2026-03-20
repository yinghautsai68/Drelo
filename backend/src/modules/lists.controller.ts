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

        const [user]: any = await db.query(
            "SELECT id FROM users WHERE id = 1 "
        );
        if (user.length === 0) {
            return res.status(404).json({ message: "User does not exists!" });
        }
        const [listCount]: any = await db.query(
            "SELECT COUNT(*) AS total_lists FROM lists WHERE user_id = 1",
        )
        const position = listCount[0].total_lists;

        const [insertList]: any = await db.query(
            "INSERT INTO lists (user_id, position, label) VALUES (?,?,?) ",
            [1, position, label]
        );

        const [newList]: any = await db.query(
            "SELECT * FROM lists WHERE id = ?",
            [insertList.insertId]
        );

        res.status(201).json({ success: true, message: "List created successsadfasdsfully!", data: newList[0] });

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
    const { lists } = req.body;
    try {
        for (const list of lists) {
            await db.query(
                "UPDATE lists SET position = ? WHERE id = ?",
                [list.position, list.id]
            )
        }


        res.status(200).json({ success: true, message: "Edited list successfsully!" });
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

        const [rows]: any = await db.query(
            "SELECT id FROM lists WHERE id = ?",
            [id]
        )
        if (rows.length === 0) {
            return res.status(404).json({ message: "List not found!" });
        }

        await db.query(
            "DELETE FROM lists where id = ?",
            [id]
        );

        res.status(200).json({ message: `List ${id} deleted!` })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
} 
