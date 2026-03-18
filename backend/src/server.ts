import express from "express";
import cors from "cors";
import { db } from "./config/db";

import authRoutes from "./modules/auth.routes";
import listsRoutes from "./modules/lists.routes";
import cardsRoutes from "./modules/cards.routes";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/cards", cardsRoutes);

app.listen(5000, () => {
    console.log("server is working!");
})