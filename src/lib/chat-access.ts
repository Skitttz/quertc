import { Types } from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import { ChatModel } from "@/models/chat";

async function getAuthenticatedChatMember({ chatId }: { chatId: string }) {
  if (!Types.ObjectId.isValid(chatId)) return null;

  const authUser = await getAuthenticatedUser();
  if (!authUser) return null;

  const authUserId = String(authUser._id);
  const chat = await ChatModel.findOne({
    _id: chatId,
    users: { $in: [authUserId] },
  });
  if (!chat) return null;

  return { authUser, authUserId, chat };
}

export { getAuthenticatedChatMember };
