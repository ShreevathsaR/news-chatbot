import express from "express";
import { answerQuery, deleteHistory, getHistory } from "../controllers/chatController.js";
const router = express.Router();

router.post("/query", answerQuery);
router.get("/history", getHistory);
router.delete("/history", deleteHistory);

export default router;
