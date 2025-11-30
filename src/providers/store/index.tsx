"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { SetCurrentUserData } from "@/store/userSlice";
import type { IStoreProviderProps } from "./types";

function StoreProvider({ children, user }: IStoreProviderProps) {
  useEffect(() => {
    if (user) {
      store.dispatch(SetCurrentUserData(user));
    }
  }, [user]);

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
