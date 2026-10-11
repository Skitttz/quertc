import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slice/chat";
import contactReducer from "./slice/contact";
import messageReducer from "./slice/message";
import presenceReducer from "./slice/presence";
import userReducer from "./slice/user";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    contact: contactReducer,
    message: messageReducer,
    presence: presenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
