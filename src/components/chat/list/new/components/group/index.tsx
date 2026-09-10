"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IUserWithVirtual } from "@/interfaces/user";
import { useAppSelector } from "@/providers/store/hooks";
import { useChat } from "@/use-cases/create-chat";
import { NewChatListUsersEmpty } from "../list/empty";
import { NewChatListUsersShimmer } from "../list/shimmer";
import { NewGroupUserItem } from "./item";

export function NewGroupChatForm({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) {
  const [users, setUsers] = useState<IUserWithVirtual[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const { currentUserData } = useAppSelector((state) => state.user);
  const { chats } = useAppSelector((state) => state.chat);
  const { createGroupChat } = useChat();

  const availableUsers = useMemo(() => {
    if (!currentUserData?._id) return [];

    const isUserAlreadyInMyGroup = (userId: string) =>
      chats.some(
        (chat) =>
          chat.isGroupChat && chat.users.some((user) => user._id === userId),
      );

    return users.filter((user) => {
      if (user._id === currentUserData._id) return false;
      if (isUserAlreadyInMyGroup(String(user._id))) return false;
      return true;
    });
  }, [users, chats, currentUserData]);

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

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateGroup = async () => {
    if (!currentUserData?._id || !groupName.trim()) return;

    setCreating(true);
    const newChat = await createGroupChat({
      users: [...selectedUserIds, currentUserData._id],
      createdBy: currentUserData._id,
      groupName: groupName.trim(),
    });
    setCreating(false);

    if (newChat) handleCloseDialog();
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={groupName}
        onChange={(event) => setGroupName(event.target.value)}
        placeholder="Nome do grupo"
      />

      {loading ? (
        <NewChatListUsersShimmer />
      ) : availableUsers.length ? (
        <div className="space-y-2">
          {availableUsers.map((user) => (
            <NewGroupUserItem
              key={user.email}
              user={user}
              isSelected={selectedUserIds.includes(String(user._id))}
              onToggle={() => toggleUser(String(user._id))}
            />
          ))}
        </div>
      ) : (
        <NewChatListUsersEmpty description="Parece que não há usuários disponíveis para adicionar ao grupo." />
      )}

      <Button
        loading={creating}
        disabled={!groupName.trim()}
        onClick={handleCreateGroup}
      >
        Criar grupo
      </Button>
    </div>
  );
}
