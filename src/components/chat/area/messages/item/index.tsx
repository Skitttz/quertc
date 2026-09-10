import type { IMessage } from "@/interfaces/message";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/utils/date-helpers";

export function ChatMessageItem({
  message,
  isMine,
}: {
  message: IMessage;
  isMine: boolean;
}) {
  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 text-sm",
          isMine ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <span className="mt-1 block text-right text-[10px] opacity-70">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
