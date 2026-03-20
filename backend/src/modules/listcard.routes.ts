import express from "express";
import { getListsWithCards, updateListCard } from "./listcards.controller";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, getListsWithCards);
router.patch("/", updateListCard);

export default router;