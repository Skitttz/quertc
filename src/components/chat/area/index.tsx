"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket-client";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { MarkChatRead } from "@/store/slice/chat";
import { fetchMessagesByChat } from "@/store/thunks/message";
import { ChatAreaEmpty } from "./empty";
import { ChatAreaHeader } from "./header";
import { ChatMessageInput } from "./input";
import { ChatMessages } from "./messages";

export function ChatArea() {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state) => state.chat);
  const { selectedChatId } = useAppSelector((state) => state.message);
  const { currentUserData } = useAppSelector((state) => state.user);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  useEffect(() => {
    if (!selectedChatId || !currentUserData) return;

    dispatch(fetchMessagesByChat(selectedChatId));
    dispatch(
      MarkChatRead({ chatId: selectedChatId, userId: currentUserData._id }),
    );

    const socket = getSocket();
    socket?.emit("chat:join", selectedChatId);

    const rejoinOnReconnect = () => socket?.emit("chat:join", selectedChatId);
    socket?.on("connect", rejoinOnReconnect);

    return () => {
      socket?.emit("chat:leave", selectedChatId);
      socket?.off("connect", rejoinOnReconnect);
    };
  }, [selectedChatId, currentUserData, dispatch]);

  if (!selectedChat) {
    return <ChatAreaEmpty />;
  }

  return (
    <div className="flex h-[85vh] flex-col rounded-sm border">
      <ChatAreaHeader chat={selectedChat} />
      <ChatMessages chatId={selectedChat._id} />
      <ChatMessageInput chatId={selectedChat._id} />
    </div>
  );
}
