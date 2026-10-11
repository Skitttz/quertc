import { UserAvatar } from "@/components/chat/avatar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/providers/store/hooks";
import { getChatDisplay, getMessagePreview } from "@/utils/chat-display";
import type { ChatItemProps } from "./types";

export function ChatItem({
  _id,
  groupName,
  groupProfilePicture,
  isGroupChat,
  isSelected,
  lastMessage,
  onSelect,
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

  const hasUnreadMessage = currentUserData
    ? !readByIds.includes(currentUserData._id)
    : false;

  return (
    <button
      type="button"
      onClick={() => onSelect(_id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent",
        isSelected && "bg-accent",
      )}
    >
      <UserAvatar
        className="size-12"
        fallbackClassName="text-lg"
        name={displayName}
        src={avatarSrc}
      />

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
        <span className="ml-auto size-2 rounded-full bg-primary" />
      )}
    </button>
  );
}
