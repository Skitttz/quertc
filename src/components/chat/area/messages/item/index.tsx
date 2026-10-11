"use client";

import {
  CheckCheckIcon,
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  Trash2Icon,
} from "lucide-react";
import { REACTION_EMOJIS } from "@/actions/message/constants";
import { ImageZoom } from "@/components/chat/image-zoom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IMessage } from "@/interfaces/message";
import type { IPublicUser } from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/utils/date-helpers";
import { splitMentions } from "@/utils/mentions";

export function ChatMessageItem({
  canPin,
  currentUserId,
  isHighlighted,
  isMine,
  isPinned,
  isReadByOthers,
  mentionable,
  message,
  onDelete,
  onEdit,
  onReact,
  onTogglePin,
  senderName,
}: {
  canPin: boolean;
  currentUserId: string | undefined;
  isHighlighted: boolean;
  isMine: boolean;
  isPinned: boolean;
  isReadByOthers: boolean;
  mentionable: IPublicUser[];
  message: IMessage;
  onDelete: (message: IMessage) => void;
  onEdit: (message: IMessage) => void;
  onReact: (message: IMessage, emoji: string) => void;
  onTogglePin: (message: IMessage) => void;
  senderName?: string;
}) {
  const isDeleted = Boolean(message.deletedAt);

  const reactions = REACTION_EMOJIS.map((emoji) => {
    const users = message.reactions.filter((item) => item.emoji === emoji);
    return {
      emoji,
      count: users.length,
      isMine: users.some((item) => item.user === currentUserId),
    };
  }).filter((reaction) => reaction.count > 0);

  return (
    <div
      id={`message-${message._id}`}
      className={cn("group flex", isMine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex max-w-[80%] items-center gap-1",
          isMine && "flex-row-reverse",
        )}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-shadow",
              isMine ? "bg-primary text-primary-foreground" : "bg-muted",
              isHighlighted && "ring-2 ring-amber-400",
            )}
          >
            {senderName && (
              <p className="mb-0.5 text-xs font-semibold text-primary">
                {senderName}
              </p>
            )}

            {isDeleted ? (
              <p className="italic opacity-70">Mensagem apagada</p>
            ) : (
              <>
                {message.image && (
                  <ImageZoom src={message.image} alt="Foto enviada na conversa">
                    <button
                      type="button"
                      aria-label="Ampliar foto"
                      className="mb-1 block overflow-hidden rounded-md"
                    >
                      {/* biome-ignore lint/performance/noImgElement: imagem remota de tamanho desconhecido */}
                      <img
                        src={message.image}
                        alt="Foto enviada na conversa"
                        className="max-h-64 max-w-full object-cover"
                      />
                    </button>
                  </ImageZoom>
                )}

                {message.text && (
                  <p className="whitespace-pre-wrap break-words">
                    {splitMentions(message.text, mentionable).map(
                      (part, index) =>
                        part.user ? (
                          <span
                            // biome-ignore lint/suspicious/noArrayIndexKey: parts of one immutable text
                            key={index}
                            className={cn(
                              "font-semibold",
                              part.user._id === currentUserId &&
                                "rounded-sm bg-amber-300/60 px-0.5 text-foreground",
                            )}
                          >
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        ),
                    )}
                  </p>
                )}
              </>
            )}

            <span className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
              {isPinned && <PinIcon aria-label="Fixada" className="size-3" />}
              {message.editedAt && !isDeleted && <span>editada</span>}
              {formatMessageTime(message.createdAt)}
              {isMine &&
                !isDeleted &&
                (isReadByOthers ? (
                  <CheckCheckIcon
                    aria-label="Lida"
                    className="size-3.5 text-sky-300"
                  />
                ) : (
                  <CheckIcon aria-label="Enviada" className="size-3.5" />
                ))}
            </span>
          </div>

          {reactions.length > 0 && (
            <div
              className={cn("flex flex-wrap gap-1", isMine && "justify-end")}
            >
              {reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  type="button"
                  aria-label={`Reação ${reaction.emoji}, ${reaction.count}`}
                  aria-pressed={reaction.isMine}
                  onClick={() => onReact(message, reaction.emoji)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors hover:bg-accent",
                    reaction.isMine && "border-primary bg-primary/10",
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-muted-foreground">
                    {reaction.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!isDeleted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Ações da mensagem"
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-opacity hover:bg-accent focus-visible:opacity-100 data-[state=open]:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <MoreHorizontalIcon className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={isMine ? "end" : "start"}>
              <div className="flex gap-0.5 px-1 py-0.5">
                {REACTION_EMOJIS.map((emoji) => (
                  <DropdownMenuItem
                    key={emoji}
                    aria-label={`Reagir com ${emoji}`}
                    className="justify-center px-1.5 text-lg"
                    onClick={() => onReact(message, emoji)}
                  >
                    {emoji}
                  </DropdownMenuItem>
                ))}
              </div>

              {canPin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onTogglePin(message)}>
                    {isPinned ? <PinOffIcon /> : <PinIcon />}
                    {isPinned ? "Desafixar" : "Fixar"}
                  </DropdownMenuItem>
                </>
              )}

              {isMine && (
                <>
                  <DropdownMenuSeparator />
                  {message.text && (
                    <DropdownMenuItem onClick={() => onEdit(message)}>
                      <PencilIcon />
                      Editar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(message)}
                  >
                    <Trash2Icon />
                    Apagar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
