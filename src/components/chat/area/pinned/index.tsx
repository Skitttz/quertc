"use client";

import { PinIcon } from "lucide-react";
import { useState } from "react";
import type { IChat } from "@/interfaces/chat";
import { useAppDispatch } from "@/providers/store/hooks";
import { OpenMessage } from "@/store/slice/message";
import { getMessagePreview } from "@/utils/chat-display";

export function PinnedMessages({ chat }: { chat: IChat }) {
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState(0);

  const pinned = [...(chat.pinnedMessages ?? [])].reverse();
  if (!pinned.length) return null;

  const current = pinned[position % pinned.length];

  return (
    <button
      type="button"
      aria-label="Ir para a mensagem fixada"
      onClick={() => {
        dispatch(OpenMessage({ chatId: chat._id, messageId: current._id }));
        setPosition((position + 1) % pinned.length);
      }}
      className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2 text-left text-sm transition-colors hover:bg-accent"
    >
      <PinIcon className="size-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 truncate">
        {getMessagePreview(current)}
      </span>
      {pinned.length > 1 && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {(position % pinned.length) + 1}/{pinned.length}
        </span>
      )}
    </button>
  );
}
