import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PresenceState {
  onlineUserIds: string[];
}

const initialState: PresenceState = {
  onlineUserIds: [],
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    SetOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUserIds = action.payload;
    },
    SetUserPresence: (
      state,
      action: PayloadAction<{ userId: string; online: boolean }>,
    ) => {
      const { userId, online } = action.payload;
      const others = state.onlineUserIds.filter((id) => id !== userId);
      state.onlineUserIds = online ? [...others, userId] : others;
    },
  },
});

export const { SetOnlineUsers, SetUserPresence } = presenceSlice.actions;
export default presenceSlice.reducer;
