"use client";

import { UserAvatar } from "@/components/chat/avatar";
import { ImageZoom } from "@/components/chat/image-zoom";

export function ZoomableAvatar({
  className,
  fallbackClassName,
  name,
  src,
}: {
  className?: string;
  fallbackClassName?: string;
  name: string;
  src?: string | null;
}) {
  const avatar = (
    <UserAvatar
      className={className}
      fallbackClassName={fallbackClassName}
      name={name}
      src={src}
    />
  );

  if (!src) return avatar;

  return (
    <ImageZoom src={src} alt={`Foto de ${name}`}>
      <button
        type="button"
        aria-label={`Ampliar foto de ${name}`}
        className="shrink-0 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {avatar}
      </button>
    </ImageZoom>
  );
}
