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

function removeUsersFromChatRoom(userIds: unknown[], chatId: string) {
  const io = getSocketServer();
  if (!io) return;

  for (const userId of userIds) {
    io.in(userRoom(String(userId))).socketsLeave(chatRoom(chatId));
  }
}

async function getUsersViewingChat(chatId: string) {
  const io = getSocketServer();
  if (!io) return [];

  const sockets = await io.in(chatRoom(chatId)).fetchSockets();

  return [...new Set(sockets.map((socket) => String(socket.data.userId)))];
}

export {
  emitToChat,
  emitToUsers,
  getUsersViewingChat,
  removeUsersFromChatRoom,
};
