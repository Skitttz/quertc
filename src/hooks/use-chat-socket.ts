"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import type { IMessage } from "@/interfaces/message";
import { connectSocket, getSocket } from "@/lib/socket-client";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { SetChatLastMessage } from "@/store/slice/chat";
import { AddMessage } from "@/store/slice/message";

type ChatSocketPayload = { chatId: string; message: IMessage };

export function useChatSocket() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );

  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;

    const handleNewMessage = (payload: ChatSocketPayload) =>
      dispatch(AddMessage(payload));
    const handleChatUpdated = (payload: ChatSocketPayload) =>
      dispatch(SetChatLastMessage(payload));

    getToken().then((token) => {
      if (cancelled || !token) return;

      const socket = connectSocket({ token });
      socket.on("message:new", handleNewMessage);
      socket.on("chat:updated", handleChatUpdated);
    });

    return () => {
      cancelled = true;
      const socket = getSocket();
      socket?.off("message:new", handleNewMessage);
      socket?.off("chat:updated", handleChatUpdated);
    };
  }, [currentUserId, dispatch, getToken]);
}
