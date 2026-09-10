import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IUserWithVirtual } from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils/text-helpers";

export function NewGroupUserItem({
  user,
  isSelected,
  onToggle,
}: {
  user: IUserWithVirtual;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2 rounded-md p-1 text-left transition-colors hover:bg-accent",
        isSelected && "bg-accent",
      )}
    >
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

      <span className="flex-1">{user.name}</span>

      <div
        className={cn(
          "size-5 shrink-0 rounded-full border-2",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground",
        )}
      />
    </button>
  );
}
