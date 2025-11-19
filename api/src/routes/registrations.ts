import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import Registration from "../models/Registration.js";
import GameRoom from "../models/GameRoom.js";
import Notification from "../models/Notification.js";
import News from "../models/News.js";
import CustomRoom from "../models/CustomRoom.js";

const router = Router();

// Register for a news post (room-creation type)
router.post(
  "/news/:newsId/register",
  requireAuth,
  async (req: any, res, next) => {
    try {
      const { newsId } = req.params;
      const { ingameName, lane, rank, roomId } = req.body;

      // Check if news is room-creation type
      const news = await News.findById(newsId);
      if (!news || news.type !== "room-creation") {
        return res
          .status(400)
          .json({ message: "This news post does not accept registrations" });
      }

      const exists = await Registration.findOne({
        user: req.user.id,
        news: newsId,
      });
      if (exists)
        return res.status(409).json({ message: "Already registered" });

      const reg = await Registration.create({
        user: req.user.id,
        news: newsId,
        ingameName,
        lane,
        rank,
        room: roomId || null,
      });

      res.json(reg);
    } catch (err) {
      next(err);
    }
  }
);

// Get all registrations for a news post
router.get(
  "/news/:newsId",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
  async (req, res, next) => {
    try {
      const items = await Registration.find({
        news: req.params.newsId,
      })
        .populate("user", "username ingameName role avatarUrl")
        .populate("room");
      res.json(items);
    } catch (err) {
      next(err);
    }
  }
);

// Get all rooms for a news post (returns CustomRooms created from this news)
router.get("/news/:newsId/rooms", requireAuth, async (req, res, next) => {
  try {
    // Get news title to match custom rooms
    const news = await News.findById(req.params.newsId);
    if (!news) {
      return res.json([]);
    }

    // Find all CustomRooms that start with the news title
    const rooms = await CustomRoom.find({
      title: { $regex: `^${news.title}`, $options: "i" },
    })
      .populate("players", "username ingameName avatarUrl")
      .populate("team1", "username ingameName avatarUrl")
      .populate("team2", "username ingameName avatarUrl")
      .sort({ createdAt: 1 });

    // Transform to match expected format (add roomNumber)
    const roomsWithNumber = rooms.map((room, index) => ({
      ...room.toObject(),
      roomNumber: index + 1,
    }));

    res.json(roomsWithNumber);
  } catch (err) {
    next(err);
  }
});

// Auto-create rooms (admin only)
router.post(
  "/news/:newsId/auto-create-rooms",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
  async (req: any, res, next) => {
    try {
      const { newsId } = req.params;
      const { gameMode, bestOf } = req.body;

      // Get news details for title
      const news = await News.findById(newsId);
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      // Check if news is room-creation type
      if (news.type !== "room-creation") {
        return res.status(400).json({
          message: "This news is not a room-creation type",
        });
      }

      // Get all pending registrations that haven't been assigned to a custom room yet
      const registrations = await Registration.find({
        news: newsId,
        $or: [
          { status: "pending", custom: null },
          { status: "pending", custom: { $exists: false } },
        ],
      }).populate("user");

      console.log(
        `Found ${registrations.length} pending registrations for news ${newsId}`
      );

      if (registrations.length === 0) {
        // Check if there are any registrations at all
        const totalRegs = await Registration.countDocuments({ news: newsId });
        const assignedRegs = await Registration.countDocuments({
          news: newsId,
          status: "assigned",
        });

        return res.status(200).json({
          message: `No pending registrations to assign. Total: ${totalRegs}, Already assigned: ${assignedRegs}`,
          rooms: [],
          totalRegistrations: totalRegs,
          assignedRegistrations: assignedRegs,
        });
      }

      // Escape special regex characters in news title
      const escapedTitle = news.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Count existing custom rooms for this news to get next number
      const existingCustoms = await CustomRoom.countDocuments({
        title: { $regex: `^${escapedTitle}`, $options: "i" },
      });

      const customRooms = [];
      let currentRoom: any = null;
      let roomCounter = existingCustoms + 1;
      let team1Count = 0;
      let team2Count = 0;
      let playerCount = 0;

      for (let i = 0; i < registrations.length; i++) {
        const reg = registrations[i];

        // Create new custom room if needed (when no room exists or current room is full)
        if (!currentRoom || playerCount >= 10) {
          // Save the previous room if it exists
          if (currentRoom) {
            await currentRoom.save();
          }

          const roomTitle = `${news.title} #${roomCounter}`;
          currentRoom = await CustomRoom.create({
            title: roomTitle,
            description: news.content || "",
            scheduleTime: new Date(),
            maxPlayers: 10,
            status: "open",
            gameMode: gameMode || "5vs5",
            bestOf: bestOf || 3,
            players: [],
            team1: [],
            team2: [],
            createdBy: req.user.id,
          });

          customRooms.push(currentRoom);
          roomCounter++;
          playerCount = 0;
          team1Count = 0;
          team2Count = 0;
        }

        // Add player to current room
        currentRoom.players.push(reg.user._id);

        // Assign to teams alternately (5 per team)
        if (team1Count < 5) {
          currentRoom.team1.push(reg.user._id);
          team1Count++;
        } else {
          currentRoom.team2.push(reg.user._id);
          team2Count++;
        }

        playerCount++;

        // Update registration status and link to custom room
        reg.status = "assigned";
        reg.custom = currentRoom._id;
        await reg.save();

        // Send notification to user
        await Notification.create({
          user: reg.user._id,
          type: "room-assignment",
          title: "Bạn đã được xếp phòng",
          message: `Bạn đã được xếp vào ${currentRoom.title}. Vui lòng kiểm tra chi tiết.`,
          relatedNews: newsId,
        });
      }

      // Save the last room and update its status
      if (currentRoom) {
        if (playerCount >= 10) {
          currentRoom.status = "full";
        }
        await currentRoom.save();
      }

      res.json({
        message: "Custom rooms created successfully",
        rooms: customRooms,
      });
    } catch (err) {
      console.error("Auto-create rooms error:", err);
      next(err);
    }
  }
);

// Legacy routes for customs (backward compatibility)
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
      ingameName: req.body.ingameName || "",
      lane: req.body.lane || "",
      rank: req.body.rank || "",
    });
    res.json(reg);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:customId/registrations",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
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

// Register for a custom room
router.post(
  "/:customRoomId/register",
  requireAuth,
  async (req: any, res, next) => {
    try {
      const { customRoomId } = req.params;

      const customRoom = await CustomRoom.findById(customRoomId);
      if (!customRoom) {
        return res.status(404).json({ message: "Custom room not found" });
      }

      // Check if already registered
      const team1Count = customRoom.team1?.length || 0;
      const team2Count = customRoom.team2?.length || 0;
      const totalPlayers = team1Count + team2Count;

      if (totalPlayers >= 10) {
        return res.status(400).json({ message: "Room is full" });
      }

      if (
        customRoom.team1?.includes(req.user.id) ||
        customRoom.team2?.includes(req.user.id)
      ) {
        return res.status(409).json({ message: "Already registered" });
      }

      // Randomly assign to team1 or team2
      const assignToTeam1 = Math.random() < 0.5;

      if (assignToTeam1 && team1Count < 5) {
        customRoom.team1 = [...(customRoom.team1 || []), req.user.id];
      } else if (team2Count < 5) {
        customRoom.team2 = [...(customRoom.team2 || []), req.user.id];
      } else {
        customRoom.team1 = [...(customRoom.team1 || []), req.user.id];
      }

      // Also add to players array
      if (!customRoom.players?.includes(req.user.id)) {
        customRoom.players = [...(customRoom.players || []), req.user.id];
      }

      await customRoom.save();

      res.json({ success: true, message: "Registered successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// Get registrations for custom room (returns team info)
router.get("/:customRoomId/registrations", async (req, res, next) => {
  try {
    const customRoom = await CustomRoom.findById(req.params.customRoomId)
      .populate("team1", "username ingameName avatarUrl")
      .populate("team2", "username ingameName avatarUrl");

    if (!customRoom) {
      return res.status(404).json({ message: "Custom room not found" });
    }

    res.json({
      team1: customRoom.team1 || [],
      team2: customRoom.team2 || [],
    });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id/approve",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
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
  requireRoles("organizer", "leader", "moderator"),
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

router.delete(
  "/:id",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
  async (req, res, next) => {
    try {
      await Registration.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// Delete a registration
router.delete(
  "/:id",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
  async (req, res, next) => {
    try {
      await Registration.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// Create a registration manually (for admin adding members)
router.post(
  "/",
  requireAuth,
  requireRoles("organizer", "leader", "moderator"),
  async (req, res, next) => {
    try {
      const { news, user, ingameName, lane, rank } = req.body;

      // Check if already registered
      const exists = await Registration.findOne({ user, news });
      if (exists) {
        return res.status(409).json({ message: "User already registered" });
      }

      const reg = await Registration.create({
        user,
        news,
        ingameName: ingameName || "Manual Add",
        lane: lane || "Giữa",
        rank: rank || "Vàng",
        status: "pending",
      });

      res.json(reg);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
