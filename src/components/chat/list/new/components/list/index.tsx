"use client";

import type { IRequestCreateChat } from "@/actions/chat/types";
import { getAllUsers } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { IUserWithVirtual } from "@/interfaces/user";
import { useAppSelector } from "@/providers/store/hooks";
import { useChat } from "@/use-cases/create-chat";
import { getNameInitials } from "@/utils/text-helpers";
import { useEffect, useMemo, useState } from "react";
import { NewChatListUsersEmpty } from "./empty";
import { NewChatListUsersShimmer } from "./shimmer";
import type { NewChatListUsersProps } from "./types";

export function NewChatListUsers({
  button,
  isGroup,
  handleCloseDialog,
}: NewChatListUsersProps) {
  const [users, setUsers] = useState<IUserWithVirtual[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCreateNewChat, setPendingCreateNewChat] = useState(false);

  const { currentUserData } = useAppSelector((state) => state.user);
  const { chats } = useAppSelector((state) => state.chat);
  const { createChat } = useChat();

  const hasPrivateChatWithUser = (userId?: string) =>
    chats.some(
      (chat) =>
        !chat.isGroupChat && chat.users.some((user) => user._id === userId),
    );

  const isUserAlreadyInMyGroup = (userId?: string) =>
    chats.some(
      (chat) =>
        chat.isGroupChat && chat.users.some((user) => user._id === userId),
    );

  const handleCreateNewChat = async ({
    targetUserId,
  }: {
    targetUserId: string;
  }) => {
    try {
      if (!currentUserData?._id) return;

      setPendingCreateNewChat(true);

      const payload: IRequestCreateChat = {
        users: [targetUserId, currentUserData._id],
        createdBy: currentUserData._id,
        isGroupChat: isGroup,
      };

      await createChat(payload);

      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao criar novo chat:", error);
    } finally {
      setPendingCreateNewChat(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const availableUsers = useMemo(() => {
    if (!currentUserData?._id) return [];

    return users.filter((user) => {
      if (user._id === currentUserData._id) return false;
      if (!isGroup && hasPrivateChatWithUser(String(user._id))) return false;
      if (isGroup && isUserAlreadyInMyGroup(String(user._id))) return false;
      return true;
    });
  }, [users, chats, currentUserData, isGroup]);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await getAllUsers();
        if (data) setUsers(data);
      } finally {
        setLoading(false);
      }
    }

    if (currentUserData?._id) {
      loadUsers();
    }
  }, [currentUserData]);

  if (loading) {
    return <NewChatListUsersShimmer />;
  }

  if (!availableUsers.length) {
    return (
      <NewChatListUsersEmpty
        description={
          isGroup
            ? "Parece que não há usuários disponíveis para iniciar um novo grupo."
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {availableUsers.map((user) => (
        <div
          key={user.email}
          className="flex w-full items-center justify-between rounded-md"
        >
          <div className="flex items-center gap-2">
            <Avatar className="size-12 border-2 border-border">
              <AvatarImage
                src={user.profilePicture}
                alt={user.name}
                className="object-cover"
              />
              {!user.profilePicture && (
                <AvatarFallback className="text-2xl">
                  {getNameInitials({ text: user.username })}
                </AvatarFallback>
              )}
            </Avatar>

            <span>{user.name}</span>
          </div>

          <Button
            loading={pendingCreateNewChat}
            onClick={() =>
              handleCreateNewChat({ targetUserId: String(user._id) })
            }
          >
            {button?.labelAction || "Criar conversa"}
          </Button>
        </div>
      ))}
    </div>
  );
}
