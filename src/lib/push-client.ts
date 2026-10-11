"use client";

import { removePushSubscription, savePushSubscription } from "@/actions/user";
import type { IPushSubscription } from "@/interfaces/user";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const SERVICE_WORKER_URL = "/sw.js";

type PushStatus = "unsupported" | "unconfigured" | "blocked" | "off" | "on";

const isPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const toUint8Array = (base64Url: string) => {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");

  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
};

async function getSubscription() {
  const registration =
    await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);

  return (await registration?.pushManager.getSubscription()) ?? null;
}

async function getPushStatus(): Promise<PushStatus> {
  if (!isPushSupported()) return "unsupported";
  if (!VAPID_PUBLIC_KEY) return "unconfigured";
  if (Notification.permission === "denied") return "blocked";

  return (await getSubscription()) ? "on" : "off";
}

async function enablePush(): Promise<PushStatus> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return getPushStatus();

  await navigator.serviceWorker.register(SERVICE_WORKER_URL);
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: toUint8Array(VAPID_PUBLIC_KEY),
  });

  const saved = await savePushSubscription({
    subscription: subscription.toJSON() as IPushSubscription,
  });
  if (!saved) await subscription.unsubscribe();

  return getPushStatus();
}

async function disablePush(): Promise<PushStatus> {
  if (!isPushSupported()) return "unsupported";

  const subscription = await getSubscription();
  if (subscription) {
    await removePushSubscription({ endpoint: subscription.endpoint });
    await subscription.unsubscribe();
  }

  return getPushStatus();
}

export { disablePush, enablePush, getPushStatus, type PushStatus };
