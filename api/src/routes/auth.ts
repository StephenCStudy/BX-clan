import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Clan from "../models/Clan.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, ingameName } = req.body;
    if (!username || !ingameName)
      return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ username });
    if (exists)
      return res.status(409).json({ message: "Username already taken" });
    // Ensure a default clan exists (single clan setup)
    let clan = await Clan.findOne();
    if (!clan)
      clan = await Clan.create({
        clanName: "BX Clan",
        description: "Wild Rift Clan",
      });
    const user = await User.create({
      username,
      ingameName,
      clan: clan._id,
    });
    const token = jwt.sign(
      { id: String(user._id), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        ingameName: user.ingameName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "User not found" });
    const token = jwt.sign(
      { id: String(user._id), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        ingameName: user.ingameName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req: any, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username ingameName role avatarUrl clan"
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/me/avatar", requireAuth, async (req: any, res, next) => {
  try {
    const { avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true }
    ).select("username ingameName role avatarUrl clan");
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
