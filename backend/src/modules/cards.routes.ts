import express from "express";
import { createCard, editCard, getCards, deleteCard, moveCard } from "./cards.controller";

const router = express.Router();

router.post("/", createCard);
router.get("/", getCards);
router.patch("/move", moveCard);
router.patch("/:id", editCard);
router.delete("/:id", deleteCard);
export default router