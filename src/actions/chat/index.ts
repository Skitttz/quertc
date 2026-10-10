"use server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/config/database";
import type { IChat } from "@/interfaces/chat";
import { userRoom } from "@/lib/socket/rooms";
import { getSocketServer } from "@/lib/socket-server";
import { ChatModel } from "@/models/chat";
import { UserModel } from "@/models/user";
import type {
  CreateChatResponse,
  IRequestCreateChat,
  IRequestCreateGroupChat,
} from "./types";

function emitChatCreated({ chat }: { chat: IChat }) {
  const io = getSocketServer();
  if (!io) return;

  for (const user of chat.users) {
    io.to(userRoom(String(user._id))).emit("chat:created", { chat });
  }
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

    const existingChat = await ChatModel.findOne({
      isGroupChat: false,
      users: { $all: [userA, userB] },
    }).populate("users");

    if (existingChat) {
      return existingChat.toObject();
    }

    const newChat = await ChatModel.create({ ...payload, isGroupChat: false });

    const populatedChat = await ChatModel.findById(newChat._id)
      .populate("users")
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

    if (!payload.users.includes(authUserId)) {
      return null;
    }

    const newChat = await ChatModel.create({
      users: payload.users,
      createdBy: authUserId,
      isGroupChat: true,
      groupName,
      groupAdmins: [authUserId],
    });

    const populatedChat = await ChatModel.findById(newChat._id)
      .populate("users")
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

    const chats = await ChatModel.find({ users: { $in: [userId] } })
      .sort({ updatedAt: -1 })
      .populate("users")
      .populate("lastMessage")
      .lean<IChat[]>();

    const formattedChats = JSON.parse(JSON.stringify(chats));

    return formattedChats;
  } catch (error) {
    console.error("Erro ao buscar chats:", error);
    return [];
  }
};
