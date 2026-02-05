import { getAllChatsByUser } from "@/actions/chat";
import type { IChat } from "@/interfaces/chat";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchChatsByUser = createAsyncThunk<IChat[], string>(
  "chat/fetchByUser",
  async (userId) => {
    const chats = await getAllChatsByUser({ userId });
    return chats;
  },
);
