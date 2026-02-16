import { createSlice } from "@reduxjs/toolkit";
import type { IChat } from "@/interfaces/chat";
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

export const { SetChats, AddChat } = chatSlice.actions;
export default chatSlice.reducer;
