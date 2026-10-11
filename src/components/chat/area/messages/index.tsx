"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { ClearHighlightedMessage } from "@/store/slice/message";
import { fetchOlderMessages } from "@/store/thunks/message";
import { useMessageActions } from "@/use-cases/message-actions";
import { getUserDisplayName } from "@/utils/chat-display";
import { ChatMessageItem } from "./item";
import { ChatMessagesShimmer } from "./shimmer";

const HIGHLIGHT_MS = 2500;
const NEAR_BOTTOM_PX = 120;

const getId = (value: IMessage["sender"]) =>
  typeof value === "string" ? value : value._id;

export function ChatMessages({
  chat,
  onEdit,
}: {
  chat: IChat;
  onEdit: (message: IMessage) => void;
}) {
  const dispatch = useAppDispatch();
  const { react, remove, togglePin } = useMessageActions();
  const {
    hasMoreByChat,
    highlightedMessageId,
    loading,
    loadingOlder,
    messagesByChat,
    typingByChat,
  } = useAppSelector((state) => state.message);
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );

  const [messageToDelete, setMessageToDelete] = useState<IMessage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasNearBottom = useRef(true);
  const previous = useRef({ firstId: "", lastId: "", scrollHeight: 0 });

  const messages = messagesByChat[chat._id] ?? [];
  const firstId = messages[0]?._id ?? "";
  const lastMessage = messages.at(-1);
  const lastId = lastMessage?._id ?? "";

  const pinnedIds = (chat.pinnedMessages ?? []).map((message) => message._id);
  const canPin =
    !chat.isGroupChat ||
    Boolean(currentUserId && chat.groupAdmins?.includes(currentUserId));

  const otherMemberIds = chat.users
    .map((user) => user._id)
    .filter((id) => id !== currentUserId);
  const typingNames = (typingByChat[chat._id] ?? [])
    .filter((id) => id !== currentUserId)
    .map((id) =>
      getUserDisplayName(chat.users.find((user) => user._id === id)),
    );

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the list grows at either end
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const before = previous.current;
    const grewAtTop = before.firstId && firstId !== before.firstId;
    const grewAtBottom = lastId !== before.lastId;

    if (grewAtTop && !grewAtBottom) {
      container.scrollTop += container.scrollHeight - before.scrollHeight;
    } else if (grewAtBottom && !highlightedMessageId) {
      const isMine = lastMessage && getId(lastMessage.sender) === currentUserId;
      if (!before.lastId || isMine || wasNearBottom.current) {
        container.scrollTop = container.scrollHeight;
      }
    }

    previous.current = {
      firstId,
      lastId,
      scrollHeight: container.scrollHeight,
    };
  }, [firstId, lastId, loading]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: waits for the message to be rendered
  useEffect(() => {
    if (!highlightedMessageId || loading) return;

    document
      .getElementById(`message-${highlightedMessageId}`)
      ?.scrollIntoView({ block: "center" });

    const timer = setTimeout(
      () => dispatch(ClearHighlightedMessage()),
      HIGHLIGHT_MS,
    );
    return () => clearTimeout(timer);
  }, [highlightedMessageId, loading, messages.length, dispatch]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    wasNearBottom.current =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      NEAR_BOTTOM_PX;
  };

  const handleConfirmDelete = async () => {
    if (messageToDelete) await remove(messageToDelete._id);
    setMessageToDelete(null);
  };

  if (loading && !messages.length) {
    return <ChatMessagesShimmer />;
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
      >
        {hasMoreByChat[chat._id] && (
          <Button
            variant="ghost"
            size="sm"
            className="self-center text-muted-foreground"
            loading={loadingOlder}
            onClick={() =>
              dispatch(
                fetchOlderMessages({
                  chatId: chat._id,
                  before: messages[0].createdAt,
                }),
              )
            }
          >
            Carregar mensagens anteriores
          </Button>
        )}

        {messages.map((message) => {
          const senderId = getId(message.sender);
          const isMine = senderId === currentUserId;
          const readIds = message.readBy.map(getId);

          return (
            <ChatMessageItem
              key={message._id}
              canPin={canPin}
              currentUserId={currentUserId}
              isPinned={pinnedIds.includes(message._id)}
              mentionable={chat.isGroupChat ? chat.users : []}
              onTogglePin={(target) => togglePin(target._id)}
              isHighlighted={message._id === highlightedMessageId}
              isMine={isMine}
              isReadByOthers={
                otherMemberIds.length > 0 &&
                otherMemberIds.every((id) => readIds.includes(id))
              }
              message={message}
              onDelete={setMessageToDelete}
              onEdit={onEdit}
              onReact={(target, emoji) => react(target._id, emoji)}
              senderName={
                chat.isGroupChat && !isMine
                  ? getUserDisplayName(
                      typeof message.sender === "string"
                        ? chat.users.find((user) => user._id === senderId)
                        : message.sender,
                    )
                  : undefined
              }
            />
          );
        })}

        {typingNames.length > 0 && (
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Loader2 className="size-3 animate-spin" />
            {typingNames.length === 1
              ? `${typingNames[0]} está digitando…`
              : `${typingNames.join(", ")} estão digitando…`}
          </p>
        )}
      </div>

      <AlertDialog
        open={Boolean(messageToDelete)}
        onOpenChange={(open) => {
          if (!open) setMessageToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar esta mensagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Ela será apagada para todos os participantes da conversa.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
