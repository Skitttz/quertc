import type { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";
import { setSocketServer } from "@/lib/socket-server";
import { ChatModel } from "@/models/chat";
import { resolveSocketUserId } from "./auth";
import {
  isOnline,
  markConnected,
  markDisconnected,
  presenceRoom,
} from "./presence";
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

    socket.on(
      "typing",
      ({ chatId, isTyping }: { chatId?: string; isTyping?: boolean } = {}) => {
        if (!chatId || !socket.rooms.has(chatRoom(chatId))) return;

        socket.to(chatRoom(chatId)).emit("typing", {
          chatId,
          userId,
          isTyping: Boolean(isTyping),
        });
      },
    );

    socket.on("presence:watch", async () => {
      try {
        const memberIds: unknown[] = await ChatModel.find({
          users: { $in: [userId] },
        }).distinct("users");
        const contactIds = memberIds.map(String).filter((id) => id !== userId);

        for (const contactId of contactIds) {
          socket.join(presenceRoom(contactId));
        }

        socket.emit("presence:sync", { online: contactIds.filter(isOnline) });
      } catch (error) {
        console.error("[socket] presence:watch failed", error);
      }
    });

    if (markConnected(userId)) {
      io.to(presenceRoom(userId)).emit("presence:update", {
        userId,
        online: true,
      });
    }

    socket.on("disconnect", () => {
      if (markDisconnected(userId)) {
        io.to(presenceRoom(userId)).emit("presence:update", {
          userId,
          online: false,
        });
      }
    });
  });

  setSocketServer(io);
  return io;
}

export { setupSocketServer };
