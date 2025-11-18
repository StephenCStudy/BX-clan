import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import Registration from "../models/Registration.js";

const router = Router();

router.post("/:customId/register", requireAuth, async (req: any, res, next) => {
  try {
    const { customId } = req.params;
    const exists = await Registration.findOne({
      user: req.user.id,
      custom: customId,
    });
    if (exists) return res.status(409).json({ message: "Already registered" });
    const reg = await Registration.create({
      user: req.user.id,
      custom: customId,
    });
    res.json(reg);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:customId/registrations",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req, res, next) => {
    try {
      const items = await Registration.find({
        custom: req.params.customId,
      }).populate("user", "username ingameName role avatarUrl");
      res.json(items);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id/approve",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req, res, next) => {
    try {
      const item = await Registration.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id/reject",
  requireAuth,
  requireRoles("organizer", "leader"),
  async (req, res, next) => {
    try {
      const item = await Registration.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
