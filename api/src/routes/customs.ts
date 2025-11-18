import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import CustomRoom from "../models/CustomRoom.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await CustomRoom.find().sort({ scheduleTime: 1 });
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
      const { title, description, scheduleTime, maxPlayers, status } = req.body;
      const item = await CustomRoom.create({
        title,
        description,
        scheduleTime,
        maxPlayers,
        status,
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
    const item = await CustomRoom.findById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req, res, next) => {
    try {
      const item = await CustomRoom.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req, res, next) => {
    try {
      await CustomRoom.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
