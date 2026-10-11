"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { IChat } from "@/interfaces/chat";
import { useAppSelector } from "@/providers/store/hooks";
import { ContactDetails } from "./contact";
import { GroupDetails } from "./group";

export function ChatDetails({
  chat,
  onOpenChange,
  open,
}: {
  chat: IChat;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );
  const contact = chat.users.find((user) => user._id !== currentUserId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[300px] flex-col gap-0 p-6 sm:w-[360px]"
      >
        <SheetHeader className="p-0">
          <SheetTitle>
            {chat.isGroupChat ? "Dados do grupo" : "Dados do contato"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {chat.isGroupChat
              ? "Participantes e configurações do grupo"
              : "Perfil da pessoa com quem você conversa"}
          </SheetDescription>
        </SheetHeader>

        {chat.isGroupChat ? (
          <GroupDetails chat={chat} onClose={() => onOpenChange(false)} />
        ) : (
          contact && <ContactDetails user={contact} />
        )}
      </SheetContent>
    </Sheet>
  );
}
