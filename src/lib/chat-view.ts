import { Types } from "mongoose";
import type { IChat } from "@/interfaces/chat";
import { emitToUsers } from "@/lib/socket/emit";
import { ChatModel } from "@/models/chat";
import { MessageModel } from "@/models/message";
import { PUBLIC_USER_FIELDS } from "@/models/user";

type LeanChat = Omit<IChat, "clearedAt"> & {
  clearedAt?: Record<string, string | Date>;
};

type UnreadSummary = { unreadCount: number; hasUnreadMention: boolean };

const PINNED_MESSAGE_FIELDS = "text image sender createdAt deletedAt";

const populatePinned = {
  path: "pinnedMessages",
  select: PINNED_MESSAGE_FIELDS,
};

async function loadChat(chatId: unknown) {
  return ChatModel.findById(chatId)
    .populate("users", PUBLIC_USER_FIELDS)
    .populate("lastMessage")
    .populate(populatePinned)
    .lean<LeanChat>();
}

function toChatFor({
  chat,
  unread,
  userId,
}: {
  chat: LeanChat;
  unread?: UnreadSummary;
  userId: string;
}): IChat {
  const { clearedAt, hiddenFor: _hiddenFor, ...visible } = chat;
  const clearedDate = clearedAt?.[userId];
  const isVisible = (message: { createdAt: string | Date }) =>
    !clearedDate || new Date(message.createdAt) > new Date(clearedDate);

  return JSON.parse(
    JSON.stringify({
      ...visible,
      lastMessage:
        visible.lastMessage && isVisible(visible.lastMessage)
          ? visible.lastMessage
          : null,
      pinnedMessages: (visible.pinnedMessages ?? []).filter(
        (message) => !message.deletedAt && isVisible(message),
      ),
      ...unread,
    }),
  );
}

async function getUnreadSummaries({
  chats,
  userId,
}: {
  chats: LeanChat[];
  userId: string;
}) {
  const summaries = new Map<string, UnreadSummary>();
  if (!chats.length) return summaries;

  const user = new Types.ObjectId(userId);
  const visibleInChat = chats.map((chat) => {
    const clearedAt = chat.clearedAt?.[userId];
    const chatId = new Types.ObjectId(String(chat._id));

    return clearedAt
      ? { chat: chatId, createdAt: { $gt: new Date(clearedAt) } }
      : { chat: chatId };
  });

  const rows = await MessageModel.aggregate<{
    _id: Types.ObjectId;
    count: number;
    mentions: number;
  }>([
    {
      $match: {
        $or: visibleInChat,
        sender: { $ne: user },
        readBy: { $ne: user },
        deletedAt: null,
      },
    },
    {
      $group: {
        _id: "$chat",
        count: { $sum: 1 },
        mentions: {
          $sum: {
            $cond: [{ $in: [user, { $ifNull: ["$mentions", []] }] }, 1, 0],
          },
        },
      },
    },
  ]);

  for (const row of rows) {
    summaries.set(String(row._id), {
      unreadCount: row.count,
      hasUnreadMention: row.mentions > 0,
    });
  }

  return summaries;
}

function emitChatChanged(chat: LeanChat) {
  for (const user of chat.users) {
    emitToUsers([user._id], "chat:changed", {
      chat: toChatFor({ chat, userId: String(user._id) }),
    });
  }
}

export {
  emitChatChanged,
  getUnreadSummaries,
  type LeanChat,
  loadChat,
  populatePinned,
  toChatFor,
};
