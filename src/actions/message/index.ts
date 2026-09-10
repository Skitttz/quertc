"use server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/config/database";
import type { IMessage } from "@/interfaces/message";
import { chatRoom, userRoom } from "@/lib/socket/rooms";
import { getSocketServer } from "@/lib/socket-server";
import { ChatModel } from "@/models/chat";
import { MessageModel } from "@/models/message";
import { UserModel } from "@/models/user";
import type { IRequestSendMessage, SendMessageResponse } from "./types";

async function getAuthenticatedChatMember({ chatId }: { chatId: string }) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const authUser = await UserModel.findOne({
    clerkUserId: clerkUser.id,
  }).lean();
  if (!authUser) return null;

  const chat = await ChatModel.findOne({
    _id: chatId,
    users: { $in: [String(authUser._id)] },
  });
  if (!chat) return null;

  return { authUser, chat };
}

export const getMessagesByChat = async ({
  chatId,
}: {
  chatId: string;
}): Promise<IMessage[]> => {
  if (!chatId) return [];

  try {
    await connectToDatabase();

    const member = await getAuthenticatedChatMember({ chatId });
    if (!member) return [];

    const authUserId = String(member.authUser._id);

    await MessageModel.updateMany(
      {
        chat: chatId,
        sender: { $ne: authUserId },
        readBy: { $ne: authUserId },
      },
      { $addToSet: { readBy: authUserId } },
    );

    const messages = await MessageModel.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>();

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
};

export const postNewMessage = async ({
  payload,
}: {
  payload: IRequestSendMessage;
}): Promise<SendMessageResponse | null> => {
  try {
    await connectToDatabase();

    const text = payload.text.trim();
    if (!text) return null;

    const member = await getAuthenticatedChatMember({ chatId: payload.chatId });
    if (!member) return null;

    const authUserId = String(member.authUser._id);
    if (payload.senderId !== authUserId) return null;

    const newMessage = await MessageModel.create({
      chat: payload.chatId,
      sender: authUserId,
      text,
      readBy: [authUserId],
    });

    await ChatModel.findByIdAndUpdate(payload.chatId, {
      $set: { lastMessage: newMessage._id },
    });

    const serializedMessage = JSON.parse(JSON.stringify(newMessage.toObject()));

    const io = getSocketServer();
    if (io) {
      io.to(chatRoom(payload.chatId)).emit("message:new", {
        chatId: payload.chatId,
        message: serializedMessage,
      });

      for (const participantId of member.chat.users) {
        io.to(userRoom(String(participantId))).emit("chat:updated", {
          chatId: payload.chatId,
          message: serializedMessage,
        });
      }
    }

    return serializedMessage;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null;
  }
};
