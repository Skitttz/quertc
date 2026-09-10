import type { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";
import { setSocketServer } from "@/lib/socket-server";
import { ChatModel } from "@/models/chat";
import { resolveSocketUserId } from "./auth";
import { chatRoom, userRoom } from "./rooms";

function setupSocketServer(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, { path: "/socket.io" });

  io.use(async (socket, next) => {
    try {
      const userId = await resolveSocketUserId({
        token: socket.handshake.auth?.token,
      });

      if (!userId) {
        console.error("[socket] handshake rejected: unresolved user");
        next(new Error("forbidden"));
        return;
      }

      socket.data.userId = userId;
      next();
    } catch (error) {
      console.error("[socket] handshake failed", error);
      next(new Error("forbidden"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(userRoom(userId));

    socket.on("chat:join", async (chatId: string) => {
      try {
        const chat = await ChatModel.findOne({
          _id: chatId,
          users: { $in: [userId] },
        }).lean();

        if (chat) socket.join(chatRoom(chatId));
      } catch (error) {
        console.error("[socket] chat:join failed", error);
      }
    });

    socket.on("chat:leave", (chatId: string) => {
      socket.leave(chatRoom(chatId));
    });
  });

  setSocketServer(io);
  return io;
}

export { setupSocketServer };
