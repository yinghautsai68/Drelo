import express from "express";
import { addTagToCard, getCardTags } from "./cardTags.controller";

const router = express.Router();

router.post("/", addTagToCard);
router.get("/", getCardTags);
export default router;