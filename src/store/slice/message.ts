import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMessage } from "@/interfaces/message";
import { fetchMessagesByChat, fetchOlderMessages } from "../thunks/message";

export interface MessageState {
  selectedChatId: string | null;
  messagesByChat: Record<string, IMessage[]>;
  hasMoreByChat: Record<string, boolean>;
  loading: boolean;
  loadingOlder: boolean;
  highlightedMessageId: string | null;
  typingByChat: Record<string, string[]>;
}

const initialState: MessageState = {
  selectedChatId: null,
  messagesByChat: {},
  hasMoreByChat: {},
  loading: false,
  loadingOlder: false,
  highlightedMessageId: null,
  typingByChat: {},
};

const mergeMessages = (current: IMessage[], incoming: IMessage[]) => {
  const merged = new Map<string, IMessage>();

  for (const message of current) merged.set(message._id, message);
  for (const message of incoming) merged.set(message._id, message);

  return [...merged.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    SelectChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
      state.highlightedMessageId = null;
    },
    OpenMessage: (
      state,
      action: PayloadAction<{ chatId: string; messageId: string }>,
    ) => {
      state.selectedChatId = action.payload.chatId;
      state.highlightedMessageId = action.payload.messageId;
    },
    ClearHighlightedMessage: (state) => {
      state.highlightedMessageId = null;
    },
    AddMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: IMessage }>,
    ) => {
      const { chatId, message } = action.payload;
      const existing = state.messagesByChat[chatId] ?? [];
      if (existing.some((item) => item._id === message._id)) return;
      state.messagesByChat[chatId] = [...existing, message];
    },
    UpdateMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: IMessage }>,
    ) => {
      const { chatId, message } = action.payload;
      const messages = state.messagesByChat[chatId];
      const index = messages?.findIndex((item) => item._id === message._id);
      if (messages && index !== undefined && index >= 0) {
        messages[index] = message;
      }
    },
    MarkMessagesRead: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const { chatId, userId } = action.payload;

      for (const message of state.messagesByChat[chatId] ?? []) {
        if (!message.readBy.includes(userId)) message.readBy.push(userId);
      }
    },
    SetTyping: (
      state,
      action: PayloadAction<{
        chatId: string;
        userId: string;
        isTyping: boolean;
      }>,
    ) => {
      const { chatId, userId, isTyping } = action.payload;
      const others = (state.typingByChat[chatId] ?? []).filter(
        (id) => id !== userId,
      );
      state.typingByChat[chatId] = isTyping ? [...others, userId] : others;
    },
    ForgetChatMessages: (state, action: PayloadAction<string>) => {
      delete state.messagesByChat[action.payload];
      delete state.hasMoreByChat[action.payload];
      delete state.typingByChat[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesByChat.fulfilled, (state, action) => {
        state.loading = false;

        const { chatId, messages, hasMore } = action.payload;
        state.messagesByChat[chatId] = mergeMessages(
          state.messagesByChat[chatId] ?? [],
          messages,
        );
        state.hasMoreByChat[chatId] = hasMore;
      })
      .addCase(fetchMessagesByChat.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchOlderMessages.pending, (state) => {
        state.loadingOlder = true;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.loadingOlder = false;

        const { chatId, messages, hasMore } = action.payload;
        state.messagesByChat[chatId] = mergeMessages(
          state.messagesByChat[chatId] ?? [],
          messages,
        );
        state.hasMoreByChat[chatId] = hasMore;
      })
      .addCase(fetchOlderMessages.rejected, (state) => {
        state.loadingOlder = false;
      });
  },
});

export const {
  AddMessage,
  ClearHighlightedMessage,
  ForgetChatMessages,
  MarkMessagesRead,
  OpenMessage,
  SelectChat,
  SetTyping,
  UpdateMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
