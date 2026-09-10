"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { store } from "@/store";
import { SetCurrentUserData } from "@/store/slice/user";
import type { IStoreProviderProps } from "./types";

function StoreProvider({ children, user }: IStoreProviderProps) {
  useEffect(() => {
    if (user) {
      store.dispatch(SetCurrentUserData(user));
    }
  }, [user]);

  return (
    <Provider store={store}>
      <ChatSocketBridge />
      {children}
    </Provider>
  );
}

function ChatSocketBridge() {
  useChatSocket();
  return null;
}

export default StoreProvider;
