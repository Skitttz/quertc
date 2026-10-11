"use server";
import { Types } from "mongoose";
import type { IMessage } from "@/interfaces/message";
import { getAuthenticatedUser } from "@/lib/auth";
import { getAuthenticatedChatMember } from "@/lib/chat-access";
import { emitToChat, emitToUsers } from "@/lib/socket/emit";
import { ChatModel } from "@/models/chat";
import { MessageModel } from "@/models/message";
import { toAccentInsensitivePattern } from "@/utils/search-helpers";
import { isFirebaseStorageUrl } from "@/utils/storage-url";
import {
  MESSAGE_AROUND_LIMIT,
  MESSAGE_CONTEXT_SIZE,
  MESSAGE_MAX_LENGTH,
  MESSAGE_PAGE_SIZE,
  MESSAGE_SEARCH_LIMIT,
  MESSAGE_SEARCH_MAX_LENGTH,
  MESSAGE_SEARCH_MIN_LENGTH,
  REACTION_EMOJIS,
} from "./constants";
import type {
  IRequestGetMessages,
  IRequestSendMessage,
  MessagePage,
  SendMessageResponse,
} from "./types";

type ChatMember = NonNullable<
  Awaited<ReturnType<typeof getAuthenticatedChatMember>>
>;

const serialize = <T>(value: unknown): T => JSON.parse(JSON.stringify(value));

const toValidDate = (value: string | undefined) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

async function markRead({ authUserId, chat }: ChatMember) {
  const { modifiedCount } = await MessageModel.updateMany(
    {
      chat: chat._id,
      sender: { $ne: authUserId },
      readBy: { $ne: authUserId },
    },
    { $addToSet: { readBy: authUserId } },
  );

  if (modifiedCount > 0) {
    emitToUsers(chat.users, "chat:read", {
      chatId: String(chat._id),
      userId: authUserId,
    });
  }
}

function emitMessageUpdated({ chat }: ChatMember, message: IMessage) {
  const chatId = String(chat._id);

  emitToChat(chatId, "message:updated", { chatId, message });

  if (String(chat.lastMessage) === message._id) {
    emitToUsers(chat.users, "chat:updated", { chatId, message });
  }
}

async function getMemberOfMessageChat({ messageId }: { messageId: string }) {
  if (!Types.ObjectId.isValid(messageId)) return null;

  const message = await MessageModel.findById(messageId);
  if (!message || message.deletedAt) return null;

  const member = await getAuthenticatedChatMember({
    chatId: String(message.chat),
  });
  if (!member) return null;

  return { member, message };
}

export const getMessagesByChat = async ({
  chatId,
  before,
  around,
}: IRequestGetMessages): Promise<MessagePage> => {
  const empty: MessagePage = { messages: [], hasMore: false };
  if (!chatId) return empty;

  try {
    const member = await getAuthenticatedChatMember({ chatId });
    if (!member) return empty;

    await markRead(member);

    const clearedAt = member.chat.clearedAt?.get(member.authUserId);
    const visibleSince = clearedAt ? { $gt: clearedAt } : {};

    const target =
      around && Types.ObjectId.isValid(around)
        ? await MessageModel.findOne({ _id: around, chat: chatId }).lean()
        : null;

    if (target) {
      const [older, fromTarget] = await Promise.all([
        MessageModel.find({
          chat: chatId,
          createdAt: { ...visibleSince, $lt: target.createdAt },
        })
          .sort({ createdAt: -1 })
          .limit(MESSAGE_CONTEXT_SIZE + 1)
          .lean(),
        MessageModel.find({
          chat: chatId,
          createdAt: { ...visibleSince, $gte: target.createdAt },
        })
          .sort({ createdAt: 1 })
          .limit(MESSAGE_AROUND_LIMIT)
          .lean(),
      ]);

      return serialize({
        messages: [
          ...older.slice(0, MESSAGE_CONTEXT_SIZE).reverse(),
          ...fromTarget,
        ],
        hasMore: older.length > MESSAGE_CONTEXT_SIZE,
      });
    }

    const beforeDate = toValidDate(before);
    const createdAt = {
      ...visibleSince,
      ...(beforeDate ? { $lt: beforeDate } : {}),
    };

    const page = await MessageModel.find({
      chat: chatId,
      ...(Object.keys(createdAt).length ? { createdAt } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(MESSAGE_PAGE_SIZE + 1)
      .lean();

    return serialize({
      messages: page.slice(0, MESSAGE_PAGE_SIZE).reverse(),
      hasMore: page.length > MESSAGE_PAGE_SIZE,
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return empty;
  }
};

export const markChatRead = async ({
  chatId,
}: {
  chatId: string;
}): Promise<boolean> => {
  try {
    const member = await getAuthenticatedChatMember({ chatId });
    if (!member) return false;

    await markRead(member);
    return true;
  } catch (error) {
    console.error("Erro ao marcar conversa como lida:", error);
    return false;
  }
};

export const postNewMessage = async ({
  payload,
}: {
  payload: IRequestSendMessage;
}): Promise<SendMessageResponse | null> => {
  try {
    const text = (payload.text ?? "").trim();
    const image = payload.image ?? "";

    if (!text && !image) return null;
    if (text.length > MESSAGE_MAX_LENGTH) return null;
    if (image && !isFirebaseStorageUrl(image)) return null;

    const member = await getAuthenticatedChatMember({ chatId: payload.chatId });
    if (!member) return null;

    const { authUserId, chat } = member;
    if (payload.senderId !== authUserId) return null;

    const newMessage = await MessageModel.create({
      chat: payload.chatId,
      sender: authUserId,
      text,
      image,
      readBy: [authUserId],
    });

    await ChatModel.findByIdAndUpdate(payload.chatId, {
      $set: { lastMessage: newMessage._id, hiddenFor: [] },
    });

    const message = serialize<SendMessageResponse>(newMessage.toObject());

    emitToChat(payload.chatId, "message:new", {
      chatId: payload.chatId,
      message,
    });
    emitToUsers(chat.users, "chat:updated", {
      chatId: payload.chatId,
      message,
    });

    return message;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null;
  }
};

export const editMessage = async ({
  messageId,
  text,
}: {
  messageId: string;
  text: string;
}): Promise<IMessage | null> => {
  try {
    const newText = (text ?? "").trim();
    if (!newText || newText.length > MESSAGE_MAX_LENGTH) return null;

    const found = await getMemberOfMessageChat({ messageId });
    if (!found) return null;

    const { member, message } = found;
    if (String(message.sender) !== member.authUserId) return null;

    message.text = newText;
    message.editedAt = new Date().toISOString();
    await message.save();

    const updated = serialize<IMessage>(message.toObject());
    emitMessageUpdated(member, updated);

    return updated;
  } catch (error) {
    console.error("Erro ao editar mensagem:", error);
    return null;
  }
};

export const deleteMessage = async ({
  messageId,
}: {
  messageId: string;
}): Promise<IMessage | null> => {
  try {
    const found = await getMemberOfMessageChat({ messageId });
    if (!found) return null;

    const { member, message } = found;
    if (String(message.sender) !== member.authUserId) return null;

    message.text = "";
    message.image = "";
    message.reactions = [];
    message.deletedAt = new Date().toISOString();
    await message.save();

    const updated = serialize<IMessage>(message.toObject());
    emitMessageUpdated(member, updated);

    return updated;
  } catch (error) {
    console.error("Erro ao apagar mensagem:", error);
    return null;
  }
};

export const toggleReaction = async ({
  messageId,
  emoji,
}: {
  messageId: string;
  emoji: string;
}): Promise<IMessage | null> => {
  try {
    if (!REACTION_EMOJIS.includes(emoji)) return null;

    const found = await getMemberOfMessageChat({ messageId });
    if (!found) return null;

    const { member, message } = found;
    const previous = message.reactions.find(
      (reaction) => String(reaction.user) === member.authUserId,
    );

    message.reactions = message.reactions.filter(
      (reaction) => String(reaction.user) !== member.authUserId,
    );
    if (previous?.emoji !== emoji) {
      message.reactions.push({ user: member.authUserId, emoji });
    }
    await message.save();

    const updated = serialize<IMessage>(message.toObject());
    emitMessageUpdated(member, updated);

    return updated;
  } catch (error) {
    console.error("Erro ao reagir à mensagem:", error);
    return null;
  }
};

export const searchMessages = async ({
  query,
}: {
  query: string;
}): Promise<IMessage[]> => {
  const term =
    typeof query === "string"
      ? query.trim().slice(0, MESSAGE_SEARCH_MAX_LENGTH)
      : "";
  if (term.length < MESSAGE_SEARCH_MIN_LENGTH) return [];

  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return [];

    const authUserId = String(authUser._id);
    const chats = await ChatModel.find({ users: { $in: [authUserId] } })
      .select("clearedAt")
      .lean();
    if (!chats.length) return [];

    const visibleInChat = chats.map((chat) => {
      const clearedAt = (
        chat.clearedAt as unknown as Record<string, Date> | undefined
      )?.[authUserId];

      return clearedAt
        ? { chat: chat._id, createdAt: { $gt: clearedAt } }
        : { chat: chat._id };
    });

    const messages = await MessageModel.find({
      $or: visibleInChat,
      deletedAt: null,
      text: { $regex: toAccentInsensitivePattern(term), $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(MESSAGE_SEARCH_LIMIT)
      .lean<IMessage[]>();

    return serialize(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
};
