import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils/text-helpers";

export function UserAvatar({
  className,
  fallbackClassName,
  name,
  src,
}: {
  className?: string;
  fallbackClassName?: string;
  name: string | undefined;
  src?: string | null;
}) {
  return (
    <Avatar className={cn("shrink-0", className)}>
      <AvatarImage
        src={src || undefined}
        alt={`Avatar de ${name ?? "usuário"}`}
        className="object-cover"
      />
      <AvatarFallback className={fallbackClassName}>
        {getNameInitials({ text: name })}
      </AvatarFallback>
    </Avatar>
  );
}
