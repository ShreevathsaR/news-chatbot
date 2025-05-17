import express from "express";
import { answerQuery } from "../controllers/chatController.js";
const router = express.Router();

router.post("/query", answerQuery);

export default router;
