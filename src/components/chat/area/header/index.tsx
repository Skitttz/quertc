import { ArrowLeftIcon } from "lucide-react";
import { ZoomableAvatar } from "@/components/chat/avatar-zoom";
import { Button } from "@/components/ui/button";
import type { IChat } from "@/interfaces/chat";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { SelectChat } from "@/store/slice/message";
import { getChatDisplay } from "@/utils/chat-display";

export function ChatAreaHeader({ chat }: { chat: IChat }) {
  const dispatch = useAppDispatch();
  const { currentUserData } = useAppSelector((state) => state.user);

  const { avatarSrc, displayName } = getChatDisplay({
    chat,
    currentUserId: currentUserData?._id,
  });

  return (
    <div className="flex items-center gap-3 border-b p-3">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Voltar para as conversas"
        onClick={() => dispatch(SelectChat(null))}
      >
        <ArrowLeftIcon />
      </Button>

      <ZoomableAvatar
        className="size-10 shrink-0"
        name={displayName ?? ""}
        src={avatarSrc}
      />

      <p className="truncate font-semibold">{displayName}</p>
    </div>
  );
}
