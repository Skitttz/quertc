import { createServer } from "node:http";
import next from "next";
import { setupSocketServer } from "@/lib/socket/setup";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandled rejection", reason);
});

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => handle(req, res));

    const upgradeHandler = app.getUpgradeHandler();
    httpServer.on("upgrade", (req, socket, head) => {
      if (req.url?.startsWith("/socket.io")) return;
      upgradeHandler(req, socket, head);
    });

    setupSocketServer(httpServer);

    httpServer.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("[server] failed to start", error);
    process.exit(1);
  });
