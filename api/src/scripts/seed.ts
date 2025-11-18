import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Clan from "../models/Clan.js";
import User from "../models/User.js";
import CustomRoom from "../models/CustomRoom.js";
import Registration from "../models/Registration.js";
import Report from "../models/Report.js";
import News from "../models/News.js";
import Comment from "../models/Comment.js";
import Stream from "../models/Stream.js";
import Invitation from "../models/Invitation.js";
import ChatMessage from "../models/ChatMessage.js";

dotenv.config();

async function run() {
  await connectDB();

  // 1) Clean collections for a fresh demo
  await Promise.all([
    User.deleteMany({}),
    Clan.deleteMany({}),
    CustomRoom.deleteMany({}),
    Registration.deleteMany({}),
    Report.deleteMany({}),
    News.deleteMany({}),
    Comment.deleteMany({}),
    Stream.deleteMany({}),
    Invitation.deleteMany({}),
    ChatMessage.deleteMany({}),
  ]);

  // 2) Create Clan
  const clan = await Clan.create({
    clanName: "BX Clan",
    description: "Wild Rift Clan Vietnam — giao lưu, học hỏi, thi đấu.",
    requirements: "Thân thiện, tôn trọng đồng đội, hoạt động hàng tuần.",
    bannerUrl:
      "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1600&q=80&auto=format&fit=crop",
  });

  // 3) Create Users with roles (no password needed)
  const users = await User.create([
    {
      username: "leader",
      ingameName: "BX-Leader",
      role: "leader",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      clan: clan._id,
    },
    {
      username: "organizer",
      ingameName: "BX-Organizer",
      role: "organizer",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      clan: clan._id,
    },
    {
      username: "moderator",
      ingameName: "BX-Mod",
      role: "moderator",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      clan: clan._id,
    },
    {
      username: "member1",
      ingameName: "BX-Member1",
      role: "member",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      clan: clan._id,
    },
    {
      username: "member2",
      ingameName: "BX-Member2",
      role: "member",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      clan: clan._id,
    },
    {
      username: "member3",
      ingameName: "BX-Member3",
      role: "member",
      avatarUrl: "https://i.pravatar.cc/150?img=6",
      clan: clan._id,
    },
  ]);
  const leader = users[0]!;
  const organizer = users[1]!;
  const moderator = users[2]!;
  const member1 = users[3]!;
  const member2 = users[4]!;
  const member3 = users[5]!;

  // 4) News + Comments
  const newsDocs = await (News as any).create([
    {
      title: "Tuyển thành viên giải tuần này",
      content:
        "BX Clan mở đăng ký giải solo/duo cuối tuần. Yêu cầu rank từ Gold trở lên.",
      createdBy: organizer._id,
      clan: clan._id,
    },
    {
      title: "Update meta patch mới",
      content:
        "Meta thay đổi mạnh ở lane rồng. ADC và Support chú ý kiểm soát mục tiêu sớm.",
      createdBy: leader._id,
      clan: clan._id,
    },
  ]);
  const news1 = newsDocs[0]!;
  const news2 = newsDocs[1]!;

  await (Comment as any).create([
    {
      user: member1._id,
      news: news1._id,
      message: "Cho mình đăng ký solo nhé!",
    },
    {
      user: member2._id,
      news: news1._id,
      message: "Mình duo với bạn @member1!",
    },
    { user: moderator._id, news: news2._id, message: "Noted, cảm ơn leader!" },
  ]);

  // 5) Custom Rooms + Registrations
  const now = new Date();
  const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const customDocs = await CustomRoom.create([
    {
      title: "Custom Scrim #1",
      description: "Giao lưu clan, map chuẩn, cấm/chọn đầy đủ",
      createdBy: organizer._id,
      scheduleTime: in2Days,
      maxPlayers: 10,
      status: "open",
      clan: clan._id,
    },
    {
      title: "Custom Training — Jungle Path",
      description: "Luyện path rừng và macro mục tiêu",
      createdBy: organizer._id,
      scheduleTime: now,
      maxPlayers: 10,
      status: "ongoing",
      clan: clan._id,
    },
    {
      title: "Custom Archive — Patch cũ",
      description: "Tổng kết meta trước",
      createdBy: leader._id,
      scheduleTime: yesterday,
      maxPlayers: 10,
      status: "closed",
      clan: clan._id,
    },
  ]);
  const c1 = customDocs[0]!;
  const c2 = customDocs[1]!;
  const c3 = customDocs[2]!;

  await Registration.create([
    { user: member1._id, custom: c1._id, status: "pending" },
    { user: member2._id, custom: c1._id, status: "approved" },
    { user: member3._id, custom: c1._id, status: "rejected" },
    { user: member1._id, custom: c2._id, status: "approved" },
  ]);

  // 6) Reports
  await Report.create([
    {
      reporter: member1._id,
      target: member2._id,
      content: "Flame trong chat, mong mod xử lý",
      status: "pending",
    },
    {
      reporter: member2._id,
      target: member3._id,
      content: "AFK trong scrim",
      status: "reviewed",
      reviewedBy: moderator._id,
    },
  ]);

  // 7) Streams
  await (Stream as any).create([
    {
      streamerName: "BX-Leader",
      platform: "youtube",
      streamUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      scheduleTime: in2Days,
    },
    {
      streamerName: "BX-Organizer",
      platform: "twitch",
      streamUrl: "https://twitch.tv/example",
      scheduleTime: now,
    },
  ]);

  // 8) Invitations
  await (Invitation as any).create([
    {
      inviter: leader._id,
      inviteeName: "Newbie#001",
      inviteeContact: "@newbie",
      status: "pending",
    },
    {
      inviter: organizer._id,
      inviteeName: "ProADC",
      inviteeContact: "pro@game.mail",
      status: "approved",
    },
  ]);

  // 9) Chat messages
  await (ChatMessage as any).create([
    { user: leader._id, message: "Chào mừng anh em đến với BX Clan!" },
    {
      user: organizer._id,
      message: "Tuần này có custom mới, nhớ đăng ký nhé.",
    },
    { user: member1._id, message: "Xin chào mọi người 👋" },
  ]);

  // 10) Summary logs
  const counts = await Promise.all([
    User.countDocuments(),
    CustomRoom.countDocuments(),
    Registration.countDocuments(),
    News.countDocuments(),
    Comment.countDocuments(),
    Report.countDocuments(),
    Stream.countDocuments(),
    Invitation.countDocuments(),
    ChatMessage.countDocuments(),
  ]);

  console.log("Seed completed ✅");
  console.log({
    users: counts[0],
    customs: counts[1],
    registrations: counts[2],
    news: counts[3],
    comments: counts[4],
    reports: counts[5],
    streams: counts[6],
    invitations: counts[7],
    messages: counts[8],
  });

  console.log("Demo accounts (no password needed):");
  console.log("- leader (BX-Leader)");
  console.log("- organizer (BX-Organizer)");
  console.log("- moderator (BX-Mod)");
  console.log("- member1 (BX-Member1)");
  console.log("- member2 (BX-Member2)");
  console.log("- member3 (BX-Member3)");

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
