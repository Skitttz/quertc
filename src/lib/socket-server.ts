import type { Server } from "socket.io";

declare global {
  var io: Server | undefined;
}

function setSocketServer(server: Server) {
  global.io = server;
}

function getSocketServer(): Server | undefined {
  return global.io;
}

export { getSocketServer, setSocketServer };
