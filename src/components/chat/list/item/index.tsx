import { ZoomableAvatar } from "@/components/chat/avatar-zoom";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/providers/store/hooks";
import { getChatDisplay, getMessagePreview } from "@/utils/chat-display";
import type { ChatItemProps } from "./types";

export function ChatItem({
  _id,
  groupName,
  groupProfilePicture,
  hasUnreadMention,
  isGroupChat,
  isSelected,
  lastMessage,
  onSelect,
  unreadCount,
  users,
}: ChatItemProps) {
  const { currentUserData } = useAppSelector((state) => state.user);

  const { avatarSrc, displayName } = getChatDisplay({
    chat: { isGroupChat, groupName, groupProfilePicture, users },
    currentUserId: currentUserData?._id,
  });

  const readByIds =
    lastMessage?.readBy?.map((user) =>
      typeof user === "string" ? user : user._id,
    ) ?? [];

  const hasUnreadMessage =
    unreadCount !== undefined
      ? unreadCount > 0
      : Boolean(currentUserData && lastMessage) &&
        !readByIds.includes(currentUserData?._id ?? "");

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent",
        isSelected && "bg-accent",
      )}
    >
      <ZoomableAvatar
        className="size-12"
        fallbackClassName="text-lg"
        name={displayName ?? ""}
        src={avatarSrc}
      />

      <button
        type="button"
        onClick={() => onSelect(_id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate font-semibold">{displayName}</p>

          {lastMessage ? (
            <span
              className={`truncate text-sm ${
                hasUnreadMessage
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {getMessagePreview(lastMessage)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground"></span>
          )}
        </div>

        {hasUnreadMessage && (
          <span className="ml-auto flex shrink-0 items-center gap-1">
            {hasUnreadMention && (
              <span
                title="Você foi mencionado"
                className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
              >
                @<span className="sr-only"> você foi mencionado</span>
              </span>
            )}
            {unreadCount ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
                <span className="sr-only"> não lidas</span>
              </span>
            ) : (
              <span className="size-2 rounded-full bg-primary" />
            )}
          </span>
        )}
      </button>
    </div>
  );
}
