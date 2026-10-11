import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMessagesByChat } from "@/actions/message";
import type { IMessage } from "@/interfaces/message";

type MessagesPayload = {
  chatId: string;
  messages: IMessage[];
  hasMore: boolean;
};

export const fetchMessagesByChat = createAsyncThunk<
  MessagesPayload & { around?: string },
  { chatId: string; around?: string }
>("message/fetchByChat", async ({ chatId, around }) => {
  const page = await getMessagesByChat({ chatId, around });
  return { chatId, around, ...page };
});

export const fetchOlderMessages = createAsyncThunk<
  MessagesPayload,
  { chatId: string; before: string }
>("message/fetchOlder", async ({ chatId, before }) => {
  const page = await getMessagesByChat({ chatId, before });
  return { chatId, ...page };
});
