"use server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/config/database";
import type { IChat } from "@/interfaces/chat";
import { getAuthenticatedChatMember } from "@/lib/chat-access";
import { emitToUsers } from "@/lib/socket/emit";
import { ChatModel } from "@/models/chat";
import { PUBLIC_USER_FIELDS, UserModel } from "@/models/user";
import { isFirebaseStorageUrl } from "@/utils/storage-url";
import type {
  CreateChatResponse,
  IRequestCreateChat,
  IRequestCreateGroupChat,
} from "./types";

function emitChatCreated({ chat }: { chat: IChat }) {
  emitToUsers(
    chat.users.map((user) => user._id),
    "chat:created",
    { chat },
  );
}

type LeanChat = Omit<IChat, "clearedAt"> & {
  clearedAt?: Record<string, string | Date>;
};

function toChatFor({
  chat,
  userId,
}: {
  chat: LeanChat;
  userId: string;
}): IChat {
  const { clearedAt, hiddenFor: _hiddenFor, ...visible } = chat;
  const clearedDate = clearedAt?.[userId];
  const lastMessage =
    clearedDate &&
    visible.lastMessage &&
    new Date(visible.lastMessage.createdAt) <= new Date(clearedDate)
      ? null
      : visible.lastMessage;

  return JSON.parse(JSON.stringify({ ...visible, lastMessage }));
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
      .lean<LeanChat[]>();

    return chats.map((chat) => toChatFor({ chat, userId }));
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
