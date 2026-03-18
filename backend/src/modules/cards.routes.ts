import express from "express";
import { createCard, editCard, getCards, deleteCard } from "./cards.controller";

const router = express.Router();

router.post("/", createCard);
router.get("/", getCards);
router.patch("/:id", editCard);
router.delete("/:id", deleteCard);
export default router