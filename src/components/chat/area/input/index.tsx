"use client";

import { SendIcon } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/use-cases/send-message";

export function ChatMessageInput({ chatId }: { chatId: string }) {
  const { sendMessage } = useSendMessage();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const sent = await sendMessage({ chatId, text: trimmed });
    setSending(false);

    if (sent) setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="flex items-end gap-2 border-t p-3">
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escreva uma mensagem"
        className="max-h-32 min-h-10 resize-none"
      />

      <Button
        size="icon"
        onClick={handleSend}
        loading={sending}
        disabled={!text.trim()}
      >
        <SendIcon />
      </Button>
    </div>
  );
}
