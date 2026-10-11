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
    AddChat: (state, action: PayloadAction<IChat>) => {
      if (state.chats.some((chat) => chat._id === action.payload._id)) return;
      state.chats.unshift(action.payload);
    },
    UpsertChat: (state, action: PayloadAction<IChat>) => {
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id,
      );
      if (index < 0) {
        state.chats.unshift(action.payload);
        return;
      }

      const { unreadCount, hasUnreadMention } = state.chats[index];
      state.chats[index] = {
        ...action.payload,
        unreadCount: action.payload.unreadCount ?? unreadCount,
        hasUnreadMention: action.payload.hasUnreadMention ?? hasUnreadMention,
      };
    },
    RemoveChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload);
    },
    SetChatLastMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: IMessage }>,
    ) => {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
      if (chat) chat.lastMessage = action.payload.message;
    },
    IncrementUnread: (
      state,
      action: PayloadAction<{ chatId: string; mentioned: boolean }>,
    ) => {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
      if (!chat) return;

      chat.unreadCount = (chat.unreadCount ?? 0) + 1;
      chat.hasUnreadMention = chat.hasUnreadMention || action.payload.mentioned;
    },
    ResetUnread: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((c) => c._id === action.payload);
      if (!chat) return;

      chat.unreadCount = 0;
      chat.hasUnreadMention = false;
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

export const {
  AddChat,
  IncrementUnread,
  MarkChatRead,
  RemoveChat,
  ResetUnread,
  SetChatLastMessage,
  SetChats,
  UpsertChat,
} = chatSlice.actions;
export default chatSlice.reducer;
