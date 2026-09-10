import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMessage } from "@/interfaces/message";
import { fetchMessagesByChat } from "../thunks/message";

export interface MessageState {
  selectedChatId: string | null;
  messagesByChat: Record<string, IMessage[]>;
  loading: boolean;
}

const initialState: MessageState = {
  selectedChatId: null,
  messagesByChat: {},
  loading: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    SelectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesByChat.fulfilled, (state, action) => {
        state.loading = false;

        const { chatId, messages } = action.payload;
        const merged = new Map<string, IMessage>();

        for (const message of state.messagesByChat[chatId] ?? []) {
          merged.set(message._id, message);
        }
        for (const message of messages) {
          merged.set(message._id, message);
        }

        state.messagesByChat[chatId] = [...merged.values()].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      })
      .addCase(fetchMessagesByChat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { SelectChat, AddMessage } = messageSlice.actions;
export default messageSlice.reducer;
