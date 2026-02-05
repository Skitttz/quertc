"use client";

import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import type { ChatState } from "@/store/slice/chat";
import { fetchChatsByUser } from "@/store/thunks/chat";
import { useEffect, type JSX } from "react";
import { ChatHeaderList } from "./header";
import { ChatItem } from "./item";
import { ChatListShimmer } from "./shimmer";

export function ChatList() {
  const dispatch = useAppDispatch();
  const { chats, loading }: ChatState = useAppSelector((state) => state.chat);
  const { currentUserData } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!currentUserData) return;
    dispatch(fetchChatsByUser(currentUserData._id));
  }, [currentUserData, dispatch]);

  const renderChatListMap: Record<string, JSX.Element | JSX.Element[]> = {
    true: <ChatListShimmer />,
    false: chats.map((chat) => <ChatItem key={chat._id} {...chat} />),
  };

  return (
    <div className="flex flex-col gap-2">
      <ChatHeaderList title="Minhas conversas" />
      <div className="border h-[76vh] overflow-y-auto rounded-sm">
        <div className="flex flex-col gap-2 p-2">
          {renderChatListMap[String(loading)]}
        </div>
      </div>
    </div>
  );
}
