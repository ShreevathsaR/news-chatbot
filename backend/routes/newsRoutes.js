import express from "express";
import { getNewsArticles } from "../controllers/newsController.js";
const router = express.Router();

router.get("/articles", getNewsArticles);

export default router;
