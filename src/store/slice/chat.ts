import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import { fetchChatsByUser } from "../thunks/chat";

export interface ChatState {
  chats: IChat[];
  loading: boolean;
}

const initialState: ChatState = {
  chats: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SetChats: (state, action) => {
      state.chats = action.payload;
    },
    AddChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    SetChatLastMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: IMessage }>,
    ) => {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
      if (chat) chat.lastMessage = action.payload.message;
    },
    MarkChatRead: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
      const readBy = chat?.lastMessage?.readBy;
      if (!readBy) return;

      const alreadyRead = readBy.some((user) =>
        typeof user === "string"
          ? user === action.payload.userId
          : user._id === action.payload.userId,
      );
      if (!alreadyRead) readBy.push(action.payload.userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChatsByUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { SetChats, AddChat, SetChatLastMessage, MarkChatRead } =
  chatSlice.actions;
export default chatSlice.reducer;
