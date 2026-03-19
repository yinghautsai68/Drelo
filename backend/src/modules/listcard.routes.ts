import express from "express";
import { getListWithCards, updateListCard } from "./listcards.controller";

const router = express.Router();

router.get("/", getListWithCards);
router.patch("/", updateListCard);

export default router;