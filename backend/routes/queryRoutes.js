import express from "express";
import { clearNotifications, createQuery, deleteQuery, getNotifications, getQueries } from "../controllers/queryController.js";
import { verifyToken } from "../controllers/authController.js";
const router = express.Router();

router.post("/query", verifyToken, createQuery);
router.get("/query", verifyToken, getQueries);
router.delete("/query/:id", verifyToken, deleteQuery);
router.get("/notifications", verifyToken, getNotifications);
router.delete("/notifications", verifyToken, clearNotifications);

export default router;
