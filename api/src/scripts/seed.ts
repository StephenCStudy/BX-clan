import dotenv from "dotenv";
import bcrypt from "bcryptjs";
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
import GameRoom from "../models/GameRoom.js";

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
    GameRoom.deleteMany({}),
  ]);

  // 2) Create Clan
  const clan = await Clan.create({
    clanName: "BX Clan",
    description: "Wild Rift Clan Vietnam — giao lưu, học hỏi, thi đấu.",
    requirements: "Thân thiện, tôn trọng đồng đội, hoạt động hàng tuần.",
    bannerUrl:
      "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1600&q=80&auto=format&fit=crop",
  });

  // 3) Create 30 Users: 1 leader, 2 organizers, 2 moderators, 25 members
  const defaultAvatar =
    "https://res.cloudinary.com/dhlsylij1/image/upload/v1763431528/OIP_qg8ut8.webp";
  const defaultPassword = await bcrypt.hash("123456", 10);

  const ranks = [
    "Đồng",
    "Bạc",
    "Vàng",
    "Bạch Kim",
    "Lục Bảo",
    "Kim Cương",
    "Cao Thủ",
    "Đại Cao Thủ",
    "Thách Đấu",
    "Tối Cao",
  ];
  const lanes = ["Baron", "Rừng", "Giữa", "Rồng", "Hỗ Trợ"];

  // 1 leader, 2 organizers, 2 moderators, 25 members = 30 total
  const roles = [
    "leader",
    "organizer",
    "organizer",
    "moderator",
    "moderator",
    ...Array(25).fill("member"),
  ];

  const usernames = [
    "leader",
    "organizer1",
    "organizer2",
    "moderator1",
    "moderator2",
    "titan",
    "shadow",
    "viper",
    "phoenix",
    "storm",
    "blaze",
    "ghost",
    "thunder",
    "razor",
    "venom",
    "frost",
    "nova",
    "saber",
    "ace",
    "hunter",
    "knight",
    "falcon",
    "dragon",
    "wolf",
    "eagle",
    "cobra",
    "panther",
    "raven",
    "hawk",
    "lynx",
  ];

  const users = await User.create(
    usernames.map((username, i) => {
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const lane1 = lanes[Math.floor(Math.random() * lanes.length)];
      const lane2 =
        Math.random() > 0.5
          ? lanes[Math.floor(Math.random() * lanes.length)]
          : null;
      const selectedLanes =
        lane2 && lane2 !== lane1 ? `${lane1}, ${lane2}` : lane1;

      return {
        username,
        password: defaultPassword,
        ingameName: `BX-${
          username.charAt(0).toUpperCase() + username.slice(1)
        }`,
        role: roles[i],
        rank: randomRank,
        lane: selectedLanes,
        avatarUrl: defaultAvatar,
        clan: clan._id,
      };
    })
  );

  const leader = users[0]!;
  const organizer1 = users[1]!;
  const organizer2 = users[2]!;
  const moderator1 = users[3]!;
  const moderator2 = users[4]!;
  const members = users.slice(5); // 25 members

  // 4) Create 5 News: 3 regular news, 2 room-creation news
  const newsDocs = await (News as any).create([
    {
      title: "Thông báo giải đấu nội bộ tuần này",
      content:
        "BX Clan tổ chức giải đấu nội bộ 5v5. Phần thưởng hấp dẫn cho đội vô địch. Đăng ký ngay!",
      type: "announcement",
      createdBy: leader._id,
      clan: clan._id,
    },
    {
      title: "Update meta mùa mới - Tháng 11",
      content:
        "Meta thay đổi mạnh: ADC buff, Assassin nerf. Tất cả hãy cập nhật chiến thuật!",
      type: "announcement",
      createdBy: organizer1._id,
      clan: clan._id,
    },
    {
      title: "Hướng dẫn leo rank hiệu quả",
      content:
        "Tips & tricks để tăng winrate: chọn tướng phù hợp, giao tiếp team, kiểm soát objectives.",
      type: "announcement",
      createdBy: moderator1._id,
      clan: clan._id,
    },
    {
      title: "Tuyển thành viên Custom Scrim #1",
      content:
        "Tạo phòng giao lưu 5v5. Yêu cầu rank Vàng trở lên. Thời gian: Thứ 7 tới.",
      type: "room-creation",
      createdBy: organizer2._id,
      clan: clan._id,
    },
    {
      title: "Tuyển thành viên Custom Training - Baron Lane",
      content:
        "Luyện tập Baron lane và teamfight. Mở cho tất cả rank. Map chuẩn thi đấu.",
      type: "room-creation",
      createdBy: moderator2._id,
      clan: clan._id,
    },
  ]);

  const news1 = newsDocs[0]!;
  const news2 = newsDocs[1]!;
  const news3 = newsDocs[2]!;
  const roomNews1 = newsDocs[3]!; // room-creation
  const roomNews2 = newsDocs[4]!; // room-creation

  // Comments on news
  await (Comment as any).create([
    {
      user: members[0]._id,
      news: news1._id,
      message: "Mình đăng ký tham gia giải nhé!",
    },
    {
      user: members[1]._id,
      news: news1._id,
      message: "Team mình sẵn sàng rồi 🔥",
    },
    {
      user: members[2]._id,
      news: news2._id,
      message: "Cảm ơn admin đã cập nhật meta!",
    },
    {
      user: members[3]._id,
      news: news3._id,
      message: "Rất hữu ích, xin tips thêm ạ!",
    },
  ]);

  // 5) Create 10 Registrations for room-creation news (roomNews1)
  const registrations = await Registration.create(
    members.slice(0, 10).map((member, i) => ({
      user: member._id,
      news: roomNews1._id,
      ingameName: member.ingameName,
      lane: member.lane,
      rank: member.rank,
      status: i < 8 ? "approved" : "pending", // 8 approved, 2 pending
    }))
  );

  // 6) Create 5 Custom Rooms (2 open, 1 ongoing, 2 closed)
  const now = new Date();
  const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Room 1: Open with 10 players and teams
  const room1Players = members.slice(0, 10).map((m) => m._id);
  const room1 = await CustomRoom.create({
    title: "Custom Scrim #1 - Full Team",
    description: "Giao lưu 5v5, map chuẩn thi đấu. Đã đủ 10 người.",
    createdBy: organizer1._id,
    scheduleTime: in2Days,
    maxPlayers: 10,
    status: "open",
    players: room1Players,
    team1: room1Players.slice(0, 5),
    team2: room1Players.slice(5, 10),
    clan: clan._id,
  });

  // Room 2: Open with partial players
  const room2Players = members.slice(10, 15).map((m) => m._id);
  const room2 = await CustomRoom.create({
    title: "Custom Training - Baron Lane",
    description: "Luyện tập Baron lane và macro. Còn thiếu 5 người.",
    createdBy: organizer2._id,
    scheduleTime: in3Days,
    maxPlayers: 10,
    status: "open",
    players: room2Players,
    team1: room2Players.slice(0, 3),
    team2: room2Players.slice(3, 5),
    clan: clan._id,
  });

  // Room 3: Ongoing with 10 players
  const room3Players = members.slice(15, 25).map((m) => m._id);
  const room3 = await CustomRoom.create({
    title: "Custom Live - Mid Lane Focus",
    description: "Đang chơi - Tập trung mid lane và roaming.",
    createdBy: moderator1._id,
    scheduleTime: now,
    maxPlayers: 10,
    status: "ongoing",
    players: room3Players,
    team1: room3Players.slice(0, 5),
    team2: room3Players.slice(5, 10),
    clan: clan._id,
  });

  // Room 4: Closed/completed
  const room4Players = members.slice(0, 10).map((m) => m._id);
  const room4 = await CustomRoom.create({
    title: "Custom Archive - Patch cũ",
    description: "Tổng kết meta patch trước. Đã hoàn thành.",
    createdBy: leader._id,
    scheduleTime: yesterday,
    maxPlayers: 10,
    status: "closed",
    players: room4Players,
    team1: room4Players.slice(0, 5),
    team2: room4Players.slice(5, 10),
    clan: clan._id,
  });

  // Room 5: Closed/completed
  const room5Players = members.slice(5, 15).map((m) => m._id);
  const room5 = await CustomRoom.create({
    title: "Custom History - Jungle Path Training",
    description: "Luyện path rừng. Hoàn thành tuần trước.",
    createdBy: moderator2._id,
    scheduleTime: lastWeek,
    maxPlayers: 10,
    status: "closed",
    players: room5Players,
    team1: room5Players.slice(0, 5),
    team2: room5Players.slice(5, 10),
    clan: clan._id,
  });

  // 7) Reports
  await Report.create([
    {
      reporter: members[0]._id,
      target: members[1]._id,
      content: "Flame trong chat, mong mod xử lý",
      status: "pending",
    },
    {
      reporter: members[2]._id,
      target: members[3]._id,
      content: "AFK trong scrim",
      status: "reviewed",
      reviewedBy: moderator1._id,
    },
    {
      reporter: members[4]._id,
      target: members[5]._id,
      content: "Chơi không tập trung, troll game",
      status: "pending",
    },
  ]);

  // 8) Streams
  await (Stream as any).create([
    {
      streamerName: "BX-Leader",
      platform: "youtube",
      streamUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      scheduleTime: in2Days,
    },
    {
      streamerName: "BX-Organizer1",
      platform: "twitch",
      streamUrl: "https://twitch.tv/bx_organizer",
      scheduleTime: now,
    },
  ]);

  // 9) Invitations
  await (Invitation as any).create([
    {
      inviter: leader._id,
      inviteeName: "NewPlayer001",
      inviteeContact: "@newplayer001",
      status: "pending",
    },
    {
      inviter: organizer1._id,
      inviteeName: "ProADC",
      inviteeContact: "pro@game.mail",
      status: "approved",
    },
    {
      inviter: organizer2._id,
      inviteeName: "SkillSupport",
      inviteeContact: "support#9999",
      status: "pending",
    },
  ]);

  // 10) Chat messages
  await (ChatMessage as any).create([
    { user: leader._id, message: "Chào mừng anh em đến với BX Clan! 🎮" },
    {
      user: organizer1._id,
      message: "Tuần này có custom mới, nhớ đăng ký nhé.",
    },
    { user: members[0]._id, message: "Xin chào mọi người 👋" },
    { user: members[1]._id, message: "Mình mới vào, xin được hướng dẫn ạ!" },
    {
      user: moderator1._id,
      message: "Welcome! Có gì thắc mắc cứ hỏi nha bạn.",
    },
  ]);

  // 11) Summary logs
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
    GameRoom.countDocuments(),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log({
    users: counts[0],
    customRooms: counts[1],
    registrations: counts[2],
    news: counts[3],
    comments: counts[4],
    reports: counts[5],
    streams: counts[6],
    invitations: counts[7],
    messages: counts[8],
    gameRooms: counts[9],
  });

  console.log("\n📊 Summary:");
  console.log("- 30 Users: 1 leader, 2 organizers, 2 moderators, 25 members");
  console.log("- 5 News: 3 general news, 2 room-creation news");
  console.log("- 10 Registrations for room-creation news");
  console.log("- 5 Custom Rooms: 2 open, 1 ongoing, 2 closed");
  console.log("- All custom rooms have 10 players divided into 2 teams");
  console.log("\n🔐 Demo accounts (password: 123456):");
  console.log("- leader (Trưởng Clan)");
  console.log("- organizer1, organizer2 (Ban Tổ Chức)");
  console.log("- moderator1, moderator2 (Quản Trị Viên)");
  console.log("- titan, shadow, viper... (25 Thành Viên)");

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
