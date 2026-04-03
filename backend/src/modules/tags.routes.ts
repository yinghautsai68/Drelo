import express from "express";
import { createTag, deleteTag, editTag, getTags } from "./tags.controller";

const router = express.Router();

router.post("/", createTag);
router.get("/", getTags);
router.patch("/:id", editTag);
router.delete("/:id", deleteTag);


export default router;