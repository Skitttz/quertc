"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/chat/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/providers/store/hooks";
import { useContacts } from "@/use-cases/contacts";
import { useChat } from "@/use-cases/create-chat";
import { NewChatListUsersEmpty } from "./empty";
import { NewChatListUsersShimmer } from "./shimmer";
import type { NewChatListUsersProps } from "./types";

export function NewChatListUsers({
  handleCloseDialog,
  onAddContact,
}: NewChatListUsersProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { currentUserData } = useAppSelector((state) => state.user);
  const { contacts, loading } = useContacts();
  const { createChat } = useChat();

  const handleOpenChat = async (targetUserId: string) => {
    if (!currentUserData?._id) return;

    setPendingId(targetUserId);
    const chat = await createChat({
      users: [targetUserId, currentUserData._id],
      createdBy: currentUserData._id,
    });
    setPendingId(null);

    if (chat) handleCloseDialog();
  };

  if (loading && !contacts.length) {
    return <NewChatListUsersShimmer />;
  }

  if (!contacts.length) {
    return (
      <NewChatListUsersEmpty
        title="Você ainda não tem contatos"
        description="Adicione alguém pelo nome ou pelo ID para começar a conversar."
        action={{ label: "Adicionar contato", onClick: onAddContact }}
      />
    );
  }

  return (
    <div className="max-h-[55vh] space-y-2 overflow-y-auto">
      {contacts.map((user) => (
        <div
          key={user._id}
          className="flex w-full items-center justify-between gap-2 rounded-md"
        >
          <div className="flex min-w-0 items-center gap-2">
            <UserAvatar
              className="size-12 border-2 border-border"
              fallbackClassName="text-2xl"
              name={user.username}
              src={user.profilePicture}
            />

            <span className="truncate">{user.name}</span>
          </div>

          <Button
            loading={pendingId === user._id}
            disabled={pendingId !== null}
            onClick={() => handleOpenChat(user._id)}
          >
            Conversar
          </Button>
        </div>
      ))}
    </div>
  );
}
