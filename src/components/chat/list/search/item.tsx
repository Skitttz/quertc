import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IChat } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import { cn } from "@/lib/utils";
import { getChatDisplay } from "@/utils/chat-display";
import { formatMessageDate } from "@/utils/date-helpers";
import { getMatchSnippet } from "@/utils/search-helpers";
import { getNameInitials } from "@/utils/text-helpers";

export function MessageSearchItem({
  chat,
  currentUserId,
  isSelected,
  message,
  onSelect,
  query,
}: {
  chat: IChat;
  currentUserId: string | undefined;
  isSelected: boolean;
  message: IMessage;
  onSelect: (chatId: string) => void;
  query: string;
}) {
  const { avatarSrc, displayName } = getChatDisplay({ chat, currentUserId });
  const { before, match, after } = getMatchSnippet({
    text: message.text,
    query,
  });

  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender._id;
  const sender = chat.users.find((user) => user._id === senderId);
  const senderLabel =
    senderId === currentUserId ? "Você" : (sender?.username ?? "");
  const showSender = chat.isGroupChat || senderId === currentUserId;

  return (
    <button
      type="button"
      onClick={() => onSelect(chat._id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent",
        isSelected && "bg-accent",
      )}
    >
      <Avatar className="size-12 shrink-0">
        {avatarSrc ? (
          <AvatarImage
            src={avatarSrc}
            alt={`Avatar de ${displayName}`}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="text-lg">
            {getNameInitials({ text: displayName })}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-semibold">{displayName}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatMessageDate(message.createdAt)}
          </span>
        </div>

        <span className="truncate text-sm text-muted-foreground">
          {showSender && senderLabel && `${senderLabel}: `}
          {before}
          <mark className="rounded-xs bg-primary/15 font-medium text-foreground">
            {match}
          </mark>
          {after}
        </span>
      </div>
    </button>
  );
}
