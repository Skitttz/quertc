"use client";

import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ImageZoom({
  alt,
  children,
  src,
}: {
  alt: string;
  children: React.ReactNode;
  src: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-auto gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Imagem ampliada
        </DialogDescription>

        {/* biome-ignore lint/performance/noImgElement: imagem remota de tamanho desconhecido, exibida no tamanho original */}
        <img
          src={src}
          alt={alt}
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
