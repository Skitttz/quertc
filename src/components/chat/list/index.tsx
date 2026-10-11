"use client";

import { useEffect, useMemo, useState } from "react";
import { useMessageSearch } from "@/hooks/use-message-search";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import type { ChatState } from "@/store/slice/chat";
import { OpenMessage, SelectChat } from "@/store/slice/message";
import { fetchChatsByUser } from "@/store/thunks/chat";
import { fetchContacts } from "@/store/thunks/contact";
import { chatMatchesSearch } from "@/utils/chat-display";
import { ChatHeaderList } from "./header";
import { ChatItem } from "./item";
import { ChatSearchResults } from "./search";
import { ChatListShimmer } from "./shimmer";

export function ChatList() {
  const dispatch = useAppDispatch();
  const { chats, loading }: ChatState = useAppSelector((state) => state.chat);
  const { currentUserData } = useAppSelector((state) => state.user);
  const { selectedChatId } = useAppSelector((state) => state.message);

  const [search, setSearch] = useState("");
  const query = search.trim();
  const { results: messageResults, loading: searchingMessages } =
    useMessageSearch(query);

  useEffect(() => {
    if (!currentUserData) return;
    dispatch(fetchChatsByUser(currentUserData._id));
    dispatch(fetchContacts());
  }, [currentUserData, dispatch]);

  useEffect(() => {
    const openFromNotification = (chatId: string | null | undefined) => {
      if (chatId && chats.some((chat) => chat._id === chatId)) {
        dispatch(SelectChat(chatId));
        return true;
      }
      return false;
    };

    const url = new URL(window.location.href);
    if (openFromNotification(url.searchParams.get("conversa"))) {
      url.searchParams.delete("conversa");
      window.history.replaceState(null, "", url);
    }

    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "open-chat") {
        openFromNotification(event.data.chatId);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [chats, dispatch]);

  const matchingChats = useMemo(
    () =>
      chats.filter((chat) =>
        chatMatchesSearch({
          chat,
          currentUserId: currentUserData?._id,
          query,
        }),
      ),
    [chats, currentUserData, query],
  );

  const handleSelect = (chatId: string) => dispatch(SelectChat(chatId));

  const renderContent = () => {
    if (loading) return <ChatListShimmer />;

    if (query) {
      return (
        <ChatSearchResults
          chats={chats}
          currentUserId={currentUserData?._id}
          matchingChats={matchingChats}
          messages={messageResults}
          onOpenMessage={(chatId, messageId) =>
            dispatch(OpenMessage({ chatId, messageId }))
          }
          onSelect={handleSelect}
          query={query}
          searchingMessages={searchingMessages}
          selectedChatId={selectedChatId}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2 p-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat._id}
            {...chat}
            isSelected={chat._id === selectedChatId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-col gap-2",
        selectedChatId && "hidden md:flex",
      )}
    >
      <ChatHeaderList
        title="Minhas conversas"
        search={search}
        onSearchChange={setSearch}
      />
      <div className="min-h-0 flex-1 overflow-y-auto rounded-sm border">
        {renderContent()}
      </div>
    </div>
  );
}
