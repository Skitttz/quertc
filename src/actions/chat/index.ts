"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/config/database";
import type { IChat } from "@/interfaces/chat";
import { getAuthenticatedChatMember } from "@/lib/chat-access";
import {
  emitChatChanged,
  getUnreadSummaries,
  type LeanChat,
  loadChat,
  populatePinned,
  toChatFor,
} from "@/lib/chat-view";
import { emitToUsers, removeUsersFromChatRoom } from "@/lib/socket/emit";
import { ChatModel } from "@/models/chat";
import { MessageModel } from "@/models/message";
import { PUBLIC_USER_FIELDS, UserModel } from "@/models/user";
import { isFirebaseStorageUrl } from "@/utils/storage-url";
import { GROUP_BIO_MAX_LENGTH, GROUP_NAME_MAX_LENGTH } from "./constants";
import type {
  CreateChatResponse,
  IRequestCreateChat,
  IRequestCreateGroupChat,
  IRequestUpdateGroup,
} from "./types";

function emitChatCreated({ chat }: { chat: IChat }) {
  emitToUsers(
    chat.users.map((user) => user._id),
    "chat:created",
    { chat },
  );
}

export const postNewChat = async ({
  payload,
}: {
  payload: IRequestCreateChat;
}): Promise<CreateChatResponse | null> => {
  try {
    await connectToDatabase();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    if (!payload || payload.users?.length !== 2) {
      return null;
    }

    const authUser = await UserModel.findOne({
      clerkUserId: clerkUser.id,
    }).lean();

    if (!authUser) {
      return null;
    }

    const [userA, userB] = payload.users;
    const authUserId = String(authUser._id);

    if (payload.createdBy !== authUserId) {
      return null;
    }

    if (![userA, userB].includes(authUserId)) {
      return null;
    }

    const existingChat = await ChatModel.findOneAndUpdate(
      { isGroupChat: false, users: { $all: [userA, userB] } },
      { $pull: { hiddenFor: authUserId } },
      { new: true },
    )
      .populate("users", PUBLIC_USER_FIELDS)
      .populate("lastMessage")
      .populate(populatePinned)
      .lean<LeanChat>();

    if (existingChat) {
      return toChatFor({
        chat: existingChat,
        userId: authUserId,
      }) as CreateChatResponse;
    }

    const newChat = await ChatModel.create({ ...payload, isGroupChat: false });

    const populatedChat = await ChatModel.findById(newChat._id)
      .populate("users", PUBLIC_USER_FIELDS)
      .populate("lastMessage")
      .lean();

    const serializedChat = JSON.parse(JSON.stringify(populatedChat));
    emitChatCreated({ chat: serializedChat });

    return serializedChat;
  } catch (error) {
    console.error("Erro ao criar uma nova conversa:", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
      payload,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return null;
  }
};

export const postNewGroupChat = async ({
  payload,
}: {
  payload: IRequestCreateGroupChat;
}): Promise<CreateChatResponse | null> => {
  try {
    await connectToDatabase();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    const groupName = payload.groupName?.trim();
    if (!groupName) {
      return null;
    }

    const authUser = await UserModel.findOne({
      clerkUserId: clerkUser.id,
    }).lean();

    if (!authUser) {
      return null;
    }

    const authUserId = String(authUser._id);

    if (payload.createdBy !== authUserId) {
      return null;
    }

    const participantIds = [...new Set(payload.users)];

    if (!participantIds.includes(authUserId)) {
      return null;
    }

    const groupProfilePicture = payload.groupProfilePicture ?? "";

    if (groupProfilePicture && !isFirebaseStorageUrl(groupProfilePicture)) {
      return null;
    }

    const newChat = await ChatModel.create({
      users: participantIds,
      createdBy: authUserId,
      isGroupChat: true,
      groupName,
      groupProfilePicture,
      groupAdmins: [authUserId],
    });

    const populatedChat = await ChatModel.findById(newChat._id)
      .populate("users", PUBLIC_USER_FIELDS)
      .populate("lastMessage")
      .lean();

    const serializedChat = JSON.parse(JSON.stringify(populatedChat));
    emitChatCreated({ chat: serializedChat });

    return serializedChat;
  } catch (error) {
    console.error("Erro ao criar um novo grupo:", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
      payload,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return null;
  }
};

export const getAllChatsByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<IChat[]> => {
  if (!userId) {
    return [];
  }

  try {
    await connectToDatabase();
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return [];
    }

    const authUser = await UserModel.findOne({
      clerkUserId: clerkUser.id,
    }).lean();

    if (!authUser || String(authUser._id) !== userId) {
      return [];
    }

    const chats = await ChatModel.find({
      users: { $in: [userId] },
      hiddenFor: { $ne: userId },
    })
      .sort({ updatedAt: -1 })
      .populate("users", PUBLIC_USER_FIELDS)
      .populate("lastMessage")
      .populate(populatePinned)
      .lean<LeanChat[]>();

    const unread = await getUnreadSummaries({ chats, userId });

    return chats.map((chat) =>
      toChatFor({
        chat,
        userId,
        unread: unread.get(String(chat._id)) ?? {
          unreadCount: 0,
          hasUnreadMention: false,
        },
      }),
    );
  } catch (error) {
    console.error("Erro ao buscar chats:", error);
    return [];
  }
};

export const clearChat = async ({
  chatId,
}: {
  chatId: string;
}): Promise<boolean> => {
  try {
    const member = await getAuthenticatedChatMember({ chatId });
    if (!member) return false;

    await ChatModel.updateOne(
      { _id: chatId },
      {
        $set: { [`clearedAt.${member.authUserId}`]: new Date() },
        $addToSet: { hiddenFor: member.authUserId },
      },
    );

    return true;
  } catch (error) {
    console.error("Erro ao apagar conversa:", error);
    return false;
  }
};

function emitChatRemoved(chatId: string, userIds: unknown[]) {
  removeUsersFromChatRoom(userIds, chatId);
  emitToUsers(userIds, "chat:removed", { chatId });
}

async function getGroupMember({ chatId }: { chatId: string }) {
  const member = await getAuthenticatedChatMember({ chatId });
  if (!member?.chat.isGroupChat) return null;

  const adminIds = (member.chat.groupAdmins ?? []).map(String);

  return { ...member, adminIds, isAdmin: adminIds.includes(member.authUserId) };
}

async function getGroupAdmin({ chatId }: { chatId: string }) {
  const member = await getGroupMember({ chatId });
  return member?.isAdmin ? member : null;
}

export const updateGroup = async ({
  chatId,
  ...changes
}: IRequestUpdateGroup): Promise<IChat | null> => {
  try {
    const admin = await getGroupAdmin({ chatId });
    if (!admin) return null;

    const update: Record<string, string> = {};

    if (changes.groupName !== undefined) {
      const groupName = changes.groupName.trim();
      if (!groupName || groupName.length > GROUP_NAME_MAX_LENGTH) return null;
      update.groupName = groupName;
    }

    if (changes.groupBio !== undefined) {
      const groupBio = changes.groupBio.trim();
      if (groupBio.length > GROUP_BIO_MAX_LENGTH) return null;
      update.groupBio = groupBio;
    }

    if (changes.groupProfilePicture !== undefined) {
      const picture = changes.groupProfilePicture;
      if (picture && !isFirebaseStorageUrl(picture)) return null;
      update.groupProfilePicture = picture;
    }

    if (!Object.keys(update).length) return null;

    await ChatModel.updateOne({ _id: chatId }, { $set: update });

    const chat = await loadChat(chatId);
    if (!chat) return null;

    emitChatChanged(chat);
    return toChatFor({ chat, userId: admin.authUserId });
  } catch (error) {
    console.error("Erro ao atualizar grupo:", error);
    return null;
  }
};

export const addGroupMembers = async ({
  chatId,
  userIds,
}: {
  chatId: string;
  userIds: string[];
}): Promise<IChat | null> => {
  try {
    const admin = await getGroupAdmin({ chatId });
    if (!admin) return null;

    const currentIds = admin.chat.users.map(String);
    const candidateIds = [...new Set(userIds ?? [])].filter(
      (id) => Types.ObjectId.isValid(id) && !currentIds.includes(id),
    );
    const newMemberIds: unknown[] = await UserModel.find({
      _id: { $in: candidateIds },
    }).distinct("_id");
    if (!newMemberIds.length) return null;

    await ChatModel.updateOne(
      { _id: chatId },
      { $addToSet: { users: { $each: newMemberIds } } },
    );

    const chat = await loadChat(chatId);
    if (!chat) return null;

    const addedIds = newMemberIds.map(String);
    for (const user of chat.users) {
      const userId = String(user._id);
      emitToUsers(
        [userId],
        addedIds.includes(userId) ? "chat:created" : "chat:changed",
        { chat: toChatFor({ chat, userId }) },
      );
    }

    return toChatFor({ chat, userId: admin.authUserId });
  } catch (error) {
    console.error("Erro ao adicionar participantes:", error);
    return null;
  }
};

export const removeGroupMember = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}): Promise<IChat | null> => {
  try {
    const admin = await getGroupAdmin({ chatId });
    if (!admin || userId === admin.authUserId) return null;
    if (!admin.chat.users.map(String).includes(userId)) return null;

    await ChatModel.updateOne(
      { _id: chatId },
      { $pull: { users: userId, groupAdmins: userId, hiddenFor: userId } },
    );

    const chat = await loadChat(chatId);
    if (!chat) return null;

    emitChatRemoved(chatId, [userId]);
    emitChatChanged(chat);

    return toChatFor({ chat, userId: admin.authUserId });
  } catch (error) {
    console.error("Erro ao remover participante:", error);
    return null;
  }
};

export const setGroupAdmin = async ({
  chatId,
  userId,
  isAdmin,
}: {
  chatId: string;
  userId: string;
  isAdmin: boolean;
}): Promise<IChat | null> => {
  try {
    const admin = await getGroupAdmin({ chatId });
    if (!admin) return null;
    if (!admin.chat.users.map(String).includes(userId)) return null;

    const isLastAdmin =
      admin.adminIds.length === 1 && admin.adminIds[0] === userId;
    if (!isAdmin && isLastAdmin) return null;

    await ChatModel.updateOne(
      { _id: chatId },
      isAdmin
        ? { $addToSet: { groupAdmins: userId } }
        : { $pull: { groupAdmins: userId } },
    );

    const chat = await loadChat(chatId);
    if (!chat) return null;

    emitChatChanged(chat);
    return toChatFor({ chat, userId: admin.authUserId });
  } catch (error) {
    console.error("Erro ao alterar administrador:", error);
    return null;
  }
};

export const leaveGroup = async ({
  chatId,
}: {
  chatId: string;
}): Promise<boolean> => {
  try {
    const member = await getGroupMember({ chatId });
    if (!member) return false;

    const { authUserId } = member;
    const remainingIds = member.chat.users
      .map(String)
      .filter((id) => id !== authUserId);

    emitChatRemoved(chatId, [authUserId]);

    if (!remainingIds.length) {
      await MessageModel.deleteMany({ chat: chatId });
      await ChatModel.deleteOne({ _id: chatId });
      return true;
    }

    const remainingAdmins = member.adminIds.filter((id) => id !== authUserId);

    await ChatModel.updateOne(
      { _id: chatId },
      {
        $pull: { users: authUserId, hiddenFor: authUserId },
        $set: {
          groupAdmins: remainingAdmins.length
            ? remainingAdmins
            : [remainingIds[0]],
        },
      },
    );

    const chat = await loadChat(chatId);
    if (chat) emitChatChanged(chat);

    return true;
  } catch (error) {
    console.error("Erro ao sair do grupo:", error);
    return false;
  }
};

export const deleteGroup = async ({
  chatId,
}: {
  chatId: string;
}): Promise<boolean> => {
  try {
    const admin = await getGroupAdmin({ chatId });
    if (!admin) return false;

    await MessageModel.deleteMany({ chat: chatId });
    await ChatModel.deleteOne({ _id: chatId });

    emitChatRemoved(chatId, admin.chat.users);
    return true;
  } catch (error) {
    console.error("Erro ao excluir grupo:", error);
    return false;
  }
};

const MAX_PINNED_MESSAGES = 3;

export const togglePinMessage = async ({
  messageId,
}: {
  messageId: string;
}): Promise<IChat | null> => {
  try {
    if (!Types.ObjectId.isValid(messageId)) return null;

    const message =
      await MessageModel.findById(messageId).select("chat deletedAt");
    if (!message || message.deletedAt) return null;

    const chatId = String(message.chat);
    const member = await getAuthenticatedChatMember({ chatId });
    if (!member) return null;

    const { authUserId, chat } = member;
    const isAdmin = (chat.groupAdmins ?? []).map(String).includes(authUserId);
    if (chat.isGroupChat && !isAdmin) return null;

    const isPinned = (chat.pinnedMessages ?? [])
      .map(String)
      .includes(messageId);

    await ChatModel.updateOne(
      { _id: chatId },
      isPinned
        ? { $pull: { pinnedMessages: messageId } }
        : {
            $push: {
              pinnedMessages: {
                $each: [messageId],
                $slice: -MAX_PINNED_MESSAGES,
              },
            },
          },
    );

    const updated = await loadChat(chatId);
    if (!updated) return null;

    emitChatChanged(updated);
    return toChatFor({ chat: updated, userId: authUserId });
  } catch (error) {
    console.error("Erro ao fixar mensagem:", error);
    return null;
  }
};
