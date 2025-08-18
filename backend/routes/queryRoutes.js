import express from "express";
import { createQuery, deleteQuery, getQueries } from "../controllers/queryController.js";
import { verifyToken } from "../controllers/authController.js";
const router = express.Router();

router.post("/query", verifyToken, createQuery);
router.get("/query", verifyToken, getQueries);
router.delete("/query/:id", verifyToken, deleteQuery);

export default router;
