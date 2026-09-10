import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMessagesByChat } from "@/actions/message";
import type { IMessage } from "@/interfaces/message";

export const fetchMessagesByChat = createAsyncThunk<
  { chatId: string; messages: IMessage[] },
  string
>("message/fetchByChat", async (chatId) => {
  const messages = await getMessagesByChat({ chatId });
  return { chatId, messages };
});
