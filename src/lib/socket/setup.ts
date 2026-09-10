import type { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";
import { ChatModel } from "@/models/chat";
import { setSocketServer } from "@/lib/socket-server";
import { resolveSocketUserId } from "./auth";
import { chatRoom, userRoom } from "./rooms";

function setupSocketServer(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, { path: "/socket.io" });

  io.use(async (socket, next) => {
    const userId = await resolveSocketUserId({
      token: socket.handshake.auth?.token,
    });

    if (!userId) {
      next(new Error("unauthorized"));
      return;
    }

    socket.data.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(userRoom(userId));

    socket.on("chat:join", async (chatId: string) => {
      const chat = await ChatModel.findOne({
        _id: chatId,
        users: { $in: [userId] },
      }).lean();

      if (chat) socket.join(chatRoom(chatId));
    });

    socket.on("chat:leave", (chatId: string) => {
      socket.leave(chatRoom(chatId));
    });
  });

  setSocketServer(io);
  return io;
}

export { setupSocketServer };
