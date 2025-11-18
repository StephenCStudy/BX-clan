import { Router } from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = Router();

router.get("/history", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const items = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "username avatarUrl");
    res.json(items.reverse());
  } catch (err) {
    next(err);
  }
});

export default router;
