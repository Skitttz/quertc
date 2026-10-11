"use client";

import { XIcon } from "lucide-react";
import { UserAvatar } from "@/components/chat/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ZoomableAvatar({
  className,
  name,
  src,
}: {
  className?: string;
  name: string;
  src: string;
}) {
  if (!src) {
    return <UserAvatar className={className} name={name} />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Ampliar foto de ${name}`}
          className="shrink-0 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserAvatar className={className} name={name} src={src} />
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-auto gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Foto de {name}</DialogTitle>
        <DialogDescription className="sr-only">
          Foto de perfil ampliada
        </DialogDescription>

        {/* biome-ignore lint/performance/noImgElement: imagem remota de tamanho desconhecido, exibida no tamanho original */}
        <img
          src={src}
          alt={`Foto de ${name}`}
          className="max-h-[80vh] max-w-full rounded-lg object-contain"
        />

        <DialogClose className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80">
          <XIcon className="size-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
