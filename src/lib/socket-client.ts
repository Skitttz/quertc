"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function connectSocket({ token }: { token: string }): Socket {
  if (socket) return socket;

  socket = io({ path: "/socket.io", auth: { token } });
  return socket;
}

function getSocket(): Socket | null {
  return socket;
}

export { connectSocket, getSocket };
