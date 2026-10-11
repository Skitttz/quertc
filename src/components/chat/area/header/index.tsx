"use client";

import { ArrowLeftIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { clearChat } from "@/actions/chat";
import { ZoomableAvatar } from "@/components/chat/avatar-zoom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IChat } from "@/interfaces/chat";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { RemoveChat } from "@/store/slice/chat";
import { ForgetChatMessages, SelectChat } from "@/store/slice/message";
import { getChatDisplay } from "@/utils/chat-display";

export function ChatAreaHeader({ chat }: { chat: IChat }) {
  const dispatch = useAppDispatch();
  const { currentUserData } = useAppSelector((state) => state.user);
  const onlineUserIds = useAppSelector((state) => state.presence.onlineUserIds);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const { avatarSrc, displayName } = getChatDisplay({
    chat,
    currentUserId: currentUserData?._id,
  });

  const others = chat.users.filter((user) => user._id !== currentUserData?._id);
  const onlineCount = others.filter((user) =>
    onlineUserIds.includes(user._id),
  ).length;

  const status = chat.isGroupChat
    ? `${chat.users.length} ${chat.users.length === 1 ? "participante" : "participantes"}${onlineCount ? ` · ${onlineCount} online` : ""}`
    : onlineCount
      ? "online"
      : "";

  const handleClear = async () => {
    setConfirmingClear(false);

    const cleared = await clearChat({ chatId: chat._id });
    if (!cleared) return;

    dispatch(SelectChat(null));
    dispatch(RemoveChat(chat._id));
    dispatch(ForgetChatMessages(chat._id));
  };

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

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-semibold">{displayName}</p>
        {status && (
          <span className="truncate text-xs text-muted-foreground">
            {status}
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Opções da conversa">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmingClear(true)}
          >
            <Trash2Icon />
            Apagar conversa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmingClear} onOpenChange={setConfirmingClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar esta conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              A conversa e o histórico somem só para você. Os outros
              participantes continuam vendo tudo, e ela volta para a sua lista
              se alguém mandar uma nova mensagem.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>Apagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
