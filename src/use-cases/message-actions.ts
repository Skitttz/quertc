"use client";

import { togglePinMessage } from "@/actions/chat";
import { deleteMessage, editMessage, toggleReaction } from "@/actions/message";
import type { IMessage } from "@/interfaces/message";
import { useAppDispatch } from "@/providers/store/hooks";
import { UpsertChat } from "@/store/slice/chat";
import { UpdateMessage } from "@/store/slice/message";

const getChatId = (chat: IMessage["chat"]) =>
  typeof chat === "string" ? chat : chat._id;

export function useMessageActions() {
  const dispatch = useAppDispatch();

  const apply = (message: IMessage | null) => {
    if (message) {
      dispatch(UpdateMessage({ chatId: getChatId(message.chat), message }));
    }
    return message;
  };

  return {
    edit: async (messageId: string, text: string) =>
      apply(await editMessage({ messageId, text })),
    remove: async (messageId: string) =>
      apply(await deleteMessage({ messageId })),
    react: async (messageId: string, emoji: string) =>
      apply(await toggleReaction({ messageId, emoji })),
    togglePin: async (messageId: string) => {
      const chat = await togglePinMessage({ messageId });
      if (chat) dispatch(UpsertChat(chat));
      return chat;
    },
  };
}
