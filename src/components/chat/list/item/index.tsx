import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/providers/store/hooks";
import { getChatDisplay } from "@/utils/chat-display";
import { getNameInitials } from "@/utils/text-helpers";
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

      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-semibold">{displayName}</p>

        {lastMessage ? (
          <span
            className={`truncate text-sm ${
              hasUnreadMessage ? "font-medium text-gray-900" : "text-gray-500"
            }`}
          >
            {lastMessage.text}
          </span>
        ) : (
          <span className="text-sm text-gray-400"></span>
        )}
      </div>

      {hasUnreadMessage && (
        <span className="ml-auto size-2 rounded-full bg-blue-500" />
      )}
    </button>
  );
}
