import express from "express";
import { createList, getLists, deleteList, moveList, editList } from "./lists.controller";

const router = express.Router();

router.post("/", createList);
router.get("/", getLists);
router.patch("/", moveList);
router.patch("/:id", editList);
router.delete("/:id", deleteList);
export default router;