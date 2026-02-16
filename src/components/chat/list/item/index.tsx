import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/providers/store/hooks";
import { getNameInitials } from "@/utils/text-helpers";
import type { ChatItemProps } from "./types";

export function ChatItem({
  groupName,
  groupProfilePicture,
  isGroupChat,
  lastMessage,
  users,
}: ChatItemProps) {
  const { currentUserData } = useAppSelector((state) => state.user);

  const recipient = !isGroupChat
    ? users.find((user) => user._id !== currentUserData?._id)
    : null;

  const avatarSrc = isGroupChat
    ? groupProfilePicture || ""
    : recipient?.profilePicture || "";

  const displayName = isGroupChat
    ? groupName
    : (recipient?.username ?? "Usuário");

  const readByIds =
    lastMessage?.readBy?.map((user) =>
      typeof user === "string" ? user : user._id,
    ) ?? [];

  const hasUnreadMessage = currentUserData
    ? !readByIds.includes(currentUserData._id)
    : false;

  return (
    <div className="flex items-center gap-3 cursor-pointer rounded-md p-2 transition-colors">
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
    </div>
  );
}
