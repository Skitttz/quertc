import webpush from "web-push";
import type { IPushSubscription } from "@/interfaces/user";
import { UserModel } from "@/models/user";

type PushPayload = { title: string; body: string; chatId: string };

const getVapidKeys = () => ({
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  privateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  subject: process.env.VAPID_SUBJECT ?? "mailto:admin@example.com",
});

const isPushConfigured = () => {
  const { publicKey, privateKey } = getVapidKeys();
  return Boolean(publicKey && privateKey);
};

async function sendPushToUsers({
  payload,
  userIds,
}: {
  payload: PushPayload;
  userIds: string[];
}) {
  if (!isPushConfigured() || !userIds.length) return;

  const { publicKey, privateKey, subject } = getVapidKeys();
  const users = await UserModel.find({
    _id: { $in: userIds },
    doNotDisturb: { $ne: true },
    "pushSubscriptions.0": { $exists: true },
  })
    .select("pushSubscriptions")
    .lean();

  await Promise.all(
    users.flatMap((user) =>
      (user.pushSubscriptions ?? []).map(
        async (subscription: IPushSubscription) => {
          try {
            await webpush.sendNotification(
              subscription,
              JSON.stringify(payload),
              { vapidDetails: { subject, publicKey, privateKey } },
            );
          } catch (error) {
            const statusCode = (error as { statusCode?: number }).statusCode;

            if (statusCode === 404 || statusCode === 410) {
              await UserModel.updateOne(
                { _id: user._id },
                {
                  $pull: {
                    pushSubscriptions: { endpoint: subscription.endpoint },
                  },
                },
              );
              return;
            }

            console.error("[push] failed to send", statusCode ?? error);
          }
        },
      ),
    ),
  );
}

export { isPushConfigured, sendPushToUsers };
