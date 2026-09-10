"use client";

import { io, type Socket } from "socket.io-client";

type GetToken = () => Promise<string | null>;

let socket: Socket | null = null;

function connectSocket({ getToken }: { getToken: GetToken }): Socket {
  if (socket) return socket;

  socket = io({
    path: "/socket.io",
    auth: (cb) => {
      getToken()
        .then((token) => cb({ token: token ?? "" }))
        .catch((error) => {
          console.error("[socket] failed to read auth token", error);
          cb({ token: "" });
        });
    },
  });

  socket.on("connect_error", (error) => {
    console.error("[socket] connection error", error.message);
  });

  return socket;
}

function getSocket(): Socket | null {
  return socket;
}

function disconnectSocket(): void {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export { connectSocket, disconnectSocket, getSocket };
