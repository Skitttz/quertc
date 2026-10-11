self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Quertc", {
      body: data.body || "",
      tag: data.chatId || "quertc",
      data: { chatId: data.chatId },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const chatId = event.notification.data?.chatId;
  const url = chatId ? `/chat?conversa=${chatId}` : "/chat";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        const open = windows.find((client) =>
          new URL(client.url).pathname.startsWith("/chat"),
        );

        if (open) {
          open.postMessage({ type: "open-chat", chatId });
          return open.focus();
        }

        return self.clients.openWindow(url);
      }),
  );
});
