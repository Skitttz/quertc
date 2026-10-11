"use client";

import {
  LogOutIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  addGroupMembers,
  deleteGroup,
  leaveGroup,
  removeGroupMember,
  setGroupAdmin,
  updateGroup,
} from "@/actions/chat";
import {
  GROUP_BIO_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
} from "@/actions/chat/constants";
import { UserAvatar } from "@/components/chat/avatar";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { IChat } from "@/interfaces/chat";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { RemoveChat, UpsertChat } from "@/store/slice/chat";
import { ForgetChatMessages, SelectChat } from "@/store/slice/message";
import { useContacts } from "@/use-cases/contacts";
import { getUploadError, uploadFileToFirebase } from "@/utils/upload-helpers";

type Confirmation = "leave" | "delete" | null;

export function GroupDetails({
  chat,
  onClose,
}: {
  chat: IChat;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(
    (state) => state.user.currentUserData?._id,
  );
  const { contacts } = useContacts();

  const [editing, setEditing] = useState(false);
  const [groupName, setGroupName] = useState(chat.groupName ?? "");
  const [groupBio, setGroupBio] = useState(chat.groupBio ?? "");
  const [adding, setAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminIds = chat.groupAdmins ?? [];
  const isAdmin = Boolean(currentUserId && adminIds.includes(currentUserId));
  const memberIds = chat.users.map((user) => user._id);
  const addableContacts = contacts.filter(
    (user) => !memberIds.includes(user._id),
  );

  const apply = async (
    change: Promise<IChat | null>,
    failure = "Não foi possível salvar a alteração. Tente novamente.",
  ) => {
    setBusy(true);
    setError(null);

    const updated = await change.catch(() => null);
    setBusy(false);

    if (updated) dispatch(UpsertChat(updated));
    else setError(failure);

    return updated;
  };

  const handleSaveInfo = async () => {
    const updated = await apply(
      updateGroup({ chatId: chat._id, groupName, groupBio }),
    );
    if (updated) setEditing(false);
  };

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const uploadError = getUploadError(file);
    if (uploadError) {
      setError(uploadError);
      return;
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    await apply(
      uploadFileToFirebase({
        file,
        path: `avatars/group-${uniqueId}.${extension}`,
      }).then((groupProfilePicture) =>
        updateGroup({ chatId: chat._id, groupProfilePicture }),
      ),
      "Não foi possível trocar a foto do grupo. Tente novamente.",
    );
  };

  const handleAddMembers = async () => {
    const updated = await apply(
      addGroupMembers({ chatId: chat._id, userIds: selectedIds }),
    );
    if (updated) {
      setAdding(false);
      setSelectedIds([]);
    }
  };

  const handleConfirm = async () => {
    const action = confirmation;
    setConfirmation(null);
    setBusy(true);

    const done =
      action === "delete"
        ? await deleteGroup({ chatId: chat._id })
        : await leaveGroup({ chatId: chat._id });
    setBusy(false);

    if (!done) {
      setError("Não foi possível concluir. Tente novamente.");
      return;
    }

    onClose();
    dispatch(SelectChat(null));
    dispatch(RemoveChat(chat._id));
    dispatch(ForgetChatMessages(chat._id));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pt-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <ZoomableAvatar
          className="size-24 border-2 border-border"
          fallbackClassName="text-2xl"
          name={chat.groupName ?? ""}
          src={chat.groupProfilePicture}
        />

        {isAdmin && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              Trocar foto
            </Button>
          </>
        )}

        {editing ? (
          <div className="flex w-full flex-col gap-2">
            <Input
              aria-label="Nome do grupo"
              value={groupName}
              maxLength={GROUP_NAME_MAX_LENGTH}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Nome do grupo"
            />
            <Textarea
              aria-label="Descrição do grupo"
              value={groupBio}
              maxLength={GROUP_BIO_MAX_LENGTH}
              onChange={(event) => setGroupBio(event.target.value)}
              placeholder="Descrição do grupo (opcional)"
              className="min-h-20 resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy}
                onClick={() => {
                  setEditing(false);
                  setGroupName(chat.groupName ?? "");
                  setGroupBio(chat.groupBio ?? "");
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={busy}
                disabled={!groupName.trim()}
                onClick={handleSaveInfo}
              >
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="break-words text-lg font-semibold">
              {chat.groupName}
            </p>
            {chat.groupBio ? (
              <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                {chat.groupBio}
              </p>
            ) : (
              isAdmin && (
                <p className="text-sm text-muted-foreground">Sem descrição</p>
              )
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <PencilIcon />
                Editar nome e descrição
              </Button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-center text-sm text-destructive">{error}</p>}

      <section className="flex flex-col gap-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            {chat.users.length}{" "}
            {chat.users.length === 1 ? "participante" : "participantes"}
          </h3>
          {isAdmin && !adding && (
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
              <UserPlusIcon />
              Adicionar
            </Button>
          )}
        </div>

        {adding && (
          <div className="flex flex-col gap-2 rounded-md border p-2">
            {addableContacts.length === 0 ? (
              <p className="py-2 text-center text-sm text-muted-foreground">
                Todos os seus contatos já estão no grupo.
              </p>
            ) : (
              addableContacts.map((user) => {
                const isSelected = selectedIds.includes(user._id);
                return (
                  <button
                    key={user._id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedIds((previous) =>
                        isSelected
                          ? previous.filter((id) => id !== user._id)
                          : [...previous, user._id],
                      )
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-md p-1 text-left transition-colors hover:bg-accent",
                      isSelected && "bg-accent",
                    )}
                  >
                    <UserAvatar
                      className="size-9"
                      name={user.username}
                      src={user.profilePicture}
                    />
                    <span className="flex-1 truncate text-sm">{user.name}</span>
                    <span
                      className={cn(
                        "size-4 shrink-0 rounded-full border-2",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground",
                      )}
                    />
                  </button>
                );
              })
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy}
                onClick={() => {
                  setAdding(false);
                  setSelectedIds([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={busy}
                disabled={!selectedIds.length}
                onClick={handleAddMembers}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-1">
          {chat.users.map((user) => {
            const isMe = user._id === currentUserId;
            const isMemberAdmin = adminIds.includes(user._id);

            return (
              <li key={user._id} className="flex items-center gap-2 py-1">
                <UserAvatar
                  className="size-10"
                  name={user.username}
                  src={user.profilePicture}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {`${user.firstName} ${user.lastName}`.trim()}
                    {isMe && " (você)"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>

                {isMemberAdmin && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    admin
                  </span>
                )}

                {isAdmin && !isMe && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={busy}
                        aria-label={`Opções de ${user.username}`}
                      >
                        <MoreVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          apply(
                            setGroupAdmin({
                              chatId: chat._id,
                              userId: user._id,
                              isAdmin: !isMemberAdmin,
                            }),
                          )
                        }
                      >
                        {isMemberAdmin ? "Remover admin" : "Tornar admin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          apply(
                            removeGroupMember({
                              chatId: chat._id,
                              userId: user._id,
                            }),
                          )
                        }
                      >
                        Remover do grupo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-auto flex flex-col gap-2 border-t pt-4">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => setConfirmation("leave")}
        >
          <LogOutIcon />
          Sair do grupo
        </Button>
        {isAdmin && (
          <Button
            variant="destructive"
            disabled={busy}
            onClick={() => setConfirmation("delete")}
          >
            <Trash2Icon />
            Excluir grupo
          </Button>
        )}
      </div>

      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation === "delete"
                ? "Excluir este grupo?"
                : "Sair deste grupo?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation === "delete"
                ? "O grupo e todas as mensagens serão apagados para todos os participantes. Isso não pode ser desfeito."
                : "Você deixa de receber as mensagens do grupo. Para voltar, um admin precisa adicionar você de novo."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {confirmation === "delete" ? "Excluir" : "Sair"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
