import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IChat } from "@/interfaces/chat";
import { useAppSelector } from "@/providers/store/hooks";
import { getChatDisplay } from "@/utils/chat-display";
import { getNameInitials } from "@/utils/text-helpers";

export function ChatAreaHeader({ chat }: { chat: IChat }) {
  const { currentUserData } = useAppSelector((state) => state.user);

  const { avatarSrc, displayName } = getChatDisplay({
    chat,
    currentUserId: currentUserData?._id,
  });

  return (
    <div className="flex items-center gap-3 border-b p-3">
      <Avatar className="size-10 shrink-0">
        {avatarSrc ? (
          <AvatarImage
            src={avatarSrc}
            alt={`Avatar de ${displayName}`}
            className="object-cover"
          />
        ) : (
          <AvatarFallback>
            {getNameInitials({ text: displayName })}
          </AvatarFallback>
        )}
      </Avatar>

      <p className="font-semibold">{displayName}</p>
    </div>
  );
}
