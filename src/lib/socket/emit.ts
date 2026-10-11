import { getSocketServer } from "@/lib/socket-server";
import { chatRoom, userRoom } from "./rooms";

function emitToChat(chatId: string, event: string, payload: unknown) {
  getSocketServer()?.to(chatRoom(chatId)).emit(event, payload);
}

function emitToUsers(userIds: unknown[], event: string, payload: unknown) {
  const io = getSocketServer();
  if (!io) return;

  for (const userId of userIds) {
    io.to(userRoom(String(userId))).emit(event, payload);
  }
}

export { emitToChat, emitToUsers };
