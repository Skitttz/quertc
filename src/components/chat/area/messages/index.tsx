"use client";

import { useEffect, useRef } from "react";
import type { IMessage } from "@/interfaces/message";
import { useAppSelector } from "@/providers/store/hooks";
import { ChatMessageItem } from "./item";
import { ChatMessagesShimmer } from "./shimmer";

const getSenderId = (sender: IMessage["sender"]) =>
  typeof sender === "string" ? sender : sender._id;

export function ChatMessages({ chatId }: { chatId: string }) {
  const { messagesByChat, loading } = useAppSelector((state) => state.message);
  const { currentUserData } = useAppSelector((state) => state.user);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = messagesByChat[chatId] ?? [];

  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (loading) {
    return <ChatMessagesShimmer />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessageItem
          key={message._id}
          message={message}
          isMine={getSenderId(message.sender) === currentUserData?._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
