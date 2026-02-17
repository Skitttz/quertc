"use client";

import { Send } from "lucide-react";
import { TypingDots } from "./components/dots";
import { MessageBubble } from "./components/message";
import { useChatPreviewAnimation } from "./hooks/useChatPreviewAnimation";

function ChatPreview() {
  const { draft, isTyping, isVisible, messages, listRef, rootRef } =
    useChatPreviewAnimation();

  return (
    <div
      ref={rootRef}
      className={`absolute inset-x-0 top-12 bottom-0 flex flex-col transition-[opacity,transform] duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        ref={listRef}
        className="relative flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && <TypingDots />}
      </div>

      <div className="h-14 border-t border-border/60 bg-card/60">
        <form
          className="flex h-full items-center gap-3 px-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={draft}
            placeholder="Digite sua mensagem..."
            readOnly
            className="flex-1 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground bg-transparent outline-none"
          />

          <span className="text-sm font-semibold flex justify-center">
            <Send className="text-gray-600" size={16} />
          </span>
        </form>
      </div>
    </div>
  );
}

export { ChatPreview };
