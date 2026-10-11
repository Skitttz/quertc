"use client";

import { useEffect, useRef, useState } from "react";
import type { IMessage } from "@/interfaces/message";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { MarkChatRead, ResetUnread } from "@/store/slice/chat";
import { fetchMessagesByChat } from "@/store/thunks/message";
import { ChatAreaEmpty } from "./empty";
import { ChatAreaHeader } from "./header";
import { ChatMessageInput } from "./input";
import { ChatMessages } from "./messages";
import { PinnedMessages } from "./pinned";

export function ChatArea() {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state) => state.chat);
  const { selectedChatId, highlightedMessageId } = useAppSelector(
    (state) => state.message,
  );
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );

  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
  const loadedChatId = useRef<string | null>(null);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  useEffect(() => {
    if (!selectedChatId || !currentUserId) {
      loadedChatId.current = null;
      return;
    }

    const chatChanged = loadedChatId.current !== selectedChatId;
    if (!chatChanged && !highlightedMessageId) return;

    loadedChatId.current = selectedChatId;
    dispatch(
      fetchMessagesByChat({
        chatId: selectedChatId,
        around: highlightedMessageId ?? undefined,
      }),
    );

    if (chatChanged) {
      setEditingMessage(null);
      dispatch(MarkChatRead({ chatId: selectedChatId, userId: currentUserId }));
      dispatch(ResetUnread(selectedChatId));
    }
  }, [selectedChatId, currentUserId, highlightedMessageId, dispatch]);

  if (!selectedChat) {
    return (
      <div className="hidden h-full rounded-sm border md:block">
        <ChatAreaEmpty />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col rounded-sm border">
      <ChatAreaHeader chat={selectedChat} />
      <PinnedMessages chat={selectedChat} />
      <ChatMessages chat={selectedChat} onEdit={setEditingMessage} />
      <ChatMessageInput
        chatId={selectedChat._id}
        mentionable={
          selectedChat.isGroupChat
            ? selectedChat.users.filter((user) => user._id !== currentUserId)
            : []
        }
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </div>
  );
}
