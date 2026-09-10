import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slice/chat";
import messageReducer from "./slice/message";
import userReducer from "./slice/user";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
