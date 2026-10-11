"use client";

import { ImageIcon, SendIcon, SmileIcon, XIcon } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MESSAGE_MAX_LENGTH } from "@/actions/message/constants";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { IMessage } from "@/interfaces/message";
import { getSocket } from "@/lib/socket-client";
import { useMessageActions } from "@/use-cases/message-actions";
import { useSendMessage } from "@/use-cases/send-message";
import { getUploadError, uploadFileToFirebase } from "@/utils/upload-helpers";
import { EMOJIS } from "./emojis";

const TYPING_IDLE_MS = 2500;

export function ChatMessageInput({
  chatId,
  editingMessage,
  onCancelEdit,
}: {
  chatId: string;
  editingMessage: IMessage | null;
  onCancelEdit: () => void;
}) {
  const { sendMessage } = useSendMessage();
  const { edit } = useMessageActions();

  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  const photoPreview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets when the chat or the edited message changes
  useEffect(() => {
    setText(editingMessage?.text ?? "");
    setPhoto(null);
    setError(null);
    textareaRef.current?.focus();
  }, [chatId, editingMessage?._id]);

  const announceTyping = (typing: boolean) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);

    if (typing !== isTyping.current) {
      isTyping.current = typing;
      getSocket()?.emit("typing", { chatId, isTyping: typing });
    }

    if (typing) {
      typingTimer.current = setTimeout(
        () => announceTyping(false),
        TYPING_IDLE_MS,
      );
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    if (!editingMessage) announceTyping(event.target.value.length > 0);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const uploadError = getUploadError(file);
    setError(uploadError);
    if (!uploadError) setPhoto(file);
  };

  const insertEmoji = (emoji: string) => {
    const field = textareaRef.current;
    const start = field?.selectionStart ?? text.length;
    const end = field?.selectionEnd ?? text.length;

    setText(`${text.slice(0, start)}${emoji}${text.slice(end)}`);
    setEmojiOpen(false);

    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const uploadPhoto = (file: File) => {
    const extension = file.name.split(".").pop() ?? "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    return uploadFileToFirebase({
      file,
      path: `avatars/message-${uniqueId}.${extension}`,
    });
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (sending || (!trimmed && !photo)) return;

    setSending(true);
    setError(null);
    announceTyping(false);

    try {
      if (editingMessage) {
        const edited = await edit(editingMessage._id, trimmed);
        if (!edited) throw new Error("edit failed");
        onCancelEdit();
        return;
      }

      const image = photo ? await uploadPhoto(photo) : undefined;
      const sent = await sendMessage({ chatId, text: trimmed, image });
      if (!sent) throw new Error("send failed");

      setText("");
      setPhoto(null);
    } catch (sendError) {
      console.error(sendError);
      setError(
        editingMessage
          ? "Não foi possível editar a mensagem. Tente novamente."
          : "Não foi possível enviar a mensagem. Tente novamente.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape" && editingMessage) {
      onCancelEdit();
      return;
    }

    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col gap-2 border-t p-3">
      {editingMessage && (
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-1.5 text-xs">
          <span className="truncate">
            <span className="font-semibold">Editando mensagem:</span>{" "}
            {editingMessage.text}
          </span>
          <button
            type="button"
            aria-label="Cancelar edição"
            onClick={onCancelEdit}
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {photoPreview && (
        <div className="relative self-start">
          {/* biome-ignore lint/performance/noImgElement: pré-visualização local do arquivo escolhido */}
          <img
            src={photoPreview}
            alt="Foto a enviar"
            className="h-20 rounded-md object-cover"
          />
          <button
            type="button"
            aria-label="Remover foto"
            disabled={sending}
            onClick={() => setPhoto(null)}
            className="absolute -top-2 -right-2 rounded-full bg-black/70 p-1 text-white"
          >
            <XIcon className="size-3" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-end gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {!editingMessage && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Enviar foto"
            disabled={sending}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon />
          </Button>
        )}

        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Inserir emoji"
            >
              <SmileIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`Emoji ${emoji}`}
                  onClick={() => insertEmoji(emoji)}
                  className="rounded-md p-1 text-xl transition-colors hover:bg-accent"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => announceTyping(false)}
          placeholder="Escreva uma mensagem"
          maxLength={MESSAGE_MAX_LENGTH}
          className="ml-1 max-h-32 min-h-10 resize-none"
        />

        <Button
          size="icon"
          aria-label={editingMessage ? "Salvar edição" : "Enviar mensagem"}
          onClick={handleSend}
          loading={sending}
          disabled={!text.trim() && !photo}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
