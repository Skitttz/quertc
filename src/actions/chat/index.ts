"use server";
import type { IChat } from "@/interfaces/chat";
import { ChatModel } from "@/models/chat";
import type { CreateChatResponse, IRequestCreateChat } from "./types";

export const postNewChat = async ({
  payload,
}: {
  payload: IRequestCreateChat;
}): Promise<CreateChatResponse | null> => {
  try {
    if (!payload || payload.users?.length !== 2) {
      return null;
    }

    const [userA, userB] = payload.users;

    const existingChat = await ChatModel.findOne({
      isGroupChat: false,
      users: { $all: [userA, userB] },
    }).populate("users");

    if (existingChat) {
      return existingChat.toObject();
    }

    const newChat = await ChatModel.create(payload);

    const populatedChat = await ChatModel.findById(newChat._id)
      .populate("users")
      .lean();

    return JSON.parse(JSON.stringify(populatedChat));
  } catch (error) {
    console.error("Erro ao criar uma nova conversa:", {
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
    const chats = await ChatModel.find({ users: { $in: [userId] } })
      .sort({ updatedAt: -1 })
      .populate("users")
      .lean<IChat[]>();

    const formattedChats = JSON.parse(JSON.stringify(chats));

    return formattedChats;
  } catch (error) {
    console.error("Erro ao buscar chats:", error);
    return [];
  }
};
