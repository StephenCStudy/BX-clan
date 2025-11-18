import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import News from "../models/News.js";
import Comment from "../models/Comment.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await News.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req: any, res, next) => {
    try {
      const { title, content } = req.body;
      const item = await News.create({
        title,
        content,
        createdBy: req.user.id,
      });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const items = await Comment.find({ news: req.params.id })
      .sort({ createdAt: 1 })
      .populate("user", "username avatarUrl");
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", requireAuth, async (req: any, res, next) => {
  try {
    const item = await Comment.create({
      news: req.params.id,
      user: req.user.id,
      message: req.body.message,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
