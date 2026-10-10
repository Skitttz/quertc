"use client";

import { CameraIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllUsers } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IUserWithVirtual } from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/providers/store/hooks";
import { useChat } from "@/use-cases/create-chat";
import { beforeUpload, uploadFileToFirebase } from "@/utils/upload-helpers";
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
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentUserData } = useAppSelector((state) => state.user);
  const { createGroupChat } = useChat();

  const availableUsers = useMemo(() => {
    if (!currentUserData?._id) return [];

    return users.filter((user) => user._id !== currentUserData._id);
  }, [users, currentUserData]);

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

  const photoPreview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !beforeUpload(file)) return;

    setPhoto(file);
  };

  const uploadGroupPhoto = (file: File) => {
    const extension = file.name.split(".").pop() ?? "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    return uploadFileToFirebase(
      { file, path: `avatars/group-${uniqueId}.${extension}` },
      { onProgress: setUploadProgress },
    );
  };

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
    setError(null);

    let groupProfilePicture: string | undefined;

    if (photo) {
      try {
        groupProfilePicture = await uploadGroupPhoto(photo);
      } catch (uploadError) {
        console.error(uploadError);
        setError("Não foi possível enviar a foto do grupo. Tente novamente.");
        setCreating(false);
        setUploadProgress(null);
        return;
      }
    }

    const newChat = await createGroupChat({
      users: [...selectedUserIds, currentUserData._id],
      createdBy: currentUserData._id,
      groupName: groupName.trim(),
      groupProfilePicture,
    });
    setCreating(false);
    setUploadProgress(null);

    if (newChat) {
      handleCloseDialog();
      return;
    }

    setError("Não foi possível criar o grupo. Tente novamente.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        <button
          type="button"
          aria-label="Escolher foto do grupo"
          disabled={creating}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border text-muted-foreground transition-colors hover:bg-accent",
            !photoPreview && "border-dashed",
          )}
        >
          {photoPreview ? (
            // biome-ignore lint/performance/noImgElement: pré-visualização local do arquivo escolhido
            <img
              src={photoPreview}
              alt="Foto do grupo"
              className="size-full object-cover"
            />
          ) : (
            <CameraIcon className="size-5" />
          )}

          {uploadProgress !== null && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
              {uploadProgress}%
            </span>
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Nome do grupo"
          />

          {photo ? (
            <button
              type="button"
              disabled={creating}
              onClick={() => setPhoto(null)}
              className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Remover foto
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Foto opcional, até 2 MB
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <NewChatListUsersShimmer />
      ) : availableUsers.length ? (
        <div className="max-h-[45vh] space-y-2 overflow-y-auto">
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

      {error && <p className="text-sm text-destructive">{error}</p>}

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
