"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import type { IMessage } from "@/interfaces/message";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket-client";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { MarkChatRead, SetChatLastMessage } from "@/store/slice/chat";
import { AddMessage } from "@/store/slice/message";

type ChatSocketPayload = { chatId: string; message: IMessage };

export function useChatSocket() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );
  const selectedChatId = useAppSelector(
    (state) => state.message.selectedChatId,
  );

  const getTokenRef = useRef(getToken);
  const selectedChatIdRef = useRef(selectedChatId);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (!currentUserId) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket({ getToken: () => getTokenRef.current() });

    const markReadWhenOpen = (chatId: string) => {
      if (chatId !== selectedChatIdRef.current) return;
      dispatch(MarkChatRead({ chatId, userId: currentUserId }));
    };

    const handleNewMessage = (payload: ChatSocketPayload) => {
      dispatch(AddMessage(payload));
      markReadWhenOpen(payload.chatId);
    };

    const handleChatUpdated = (payload: ChatSocketPayload) => {
      dispatch(SetChatLastMessage(payload));
      markReadWhenOpen(payload.chatId);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("chat:updated", handleChatUpdated);

    return () => {
      disconnectSocket();
    };
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (!currentUserId || !selectedChatId) return;

    const socket = getSocket();
    if (!socket) return;

    const joinRoom = () => socket.emit("chat:join", selectedChatId);

    joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("chat:leave", selectedChatId);
    };
  }, [currentUserId, selectedChatId]);
}
