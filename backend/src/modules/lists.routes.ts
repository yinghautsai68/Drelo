import express from "express";
import { createList, getLists, deleteList, moveList, editList } from "./lists.controller";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.post("/", authenticate, createList);
router.get("/", authenticate, getLists);
router.patch("/", authenticate, moveList);
router.patch("/:id", authenticate, editList);
router.delete("/:id", authenticate, deleteList);
export default router;