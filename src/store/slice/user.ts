import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ISafeUserType } from "@/components/layout/header/private/types";

interface IUserState {
  currentUserData: ISafeUserType | null;
  currentUserId: string;
}

const initialState: IUserState = {
  currentUserData: null,
  currentUserId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetCurrentUserData(state, action: PayloadAction<ISafeUserType | null>) {
      state.currentUserData = action.payload;
    },
    patchCurrentUserData(state, action: PayloadAction<Partial<ISafeUserType>>) {
      if (!state.currentUserData) return;

      state.currentUserData = {
        ...state.currentUserData,
        ...action.payload,
      };
    },
    SetCurrentUserId(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload;
    },
  },
});

export const { SetCurrentUserData, patchCurrentUserData, SetCurrentUserId } =
  userSlice.actions;
export default userSlice.reducer;
