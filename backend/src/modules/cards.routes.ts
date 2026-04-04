import express from "express";
import { createCard, editCard, getCards, deleteCard, moveCard } from "./cards.controller";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.post("/", authenticate, createCard);
router.get("/", authenticate, getCards);
router.patch("/move", authenticate, moveCard);
router.patch("/:id", authenticate, editCard);
router.delete("/:id", authenticate, deleteCard);
export default router