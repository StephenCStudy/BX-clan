import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import ChatMessage from "./models/ChatMessage.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on(
      "message:send",
      async (payload: { userId: string; message: string }) => {
        if (!payload?.message || !payload?.userId) return;
        const doc = await ChatMessage.create({
          user: payload.userId,
          message: payload.message,
        });
        io.emit("message:receive", {
          id: String(doc._id),
          user: String(doc.user),
          message: doc.message,
          createdAt: doc.createdAt,
        });
      }
    );
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
