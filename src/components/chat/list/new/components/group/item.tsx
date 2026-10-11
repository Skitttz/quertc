import { UserAvatar } from "@/components/chat/avatar";
import type { IPublicUserWithName } from "@/interfaces/user";
import { cn } from "@/lib/utils";

export function NewGroupUserItem({
  user,
  isSelected,
  onToggle,
}: {
  user: IPublicUserWithName;
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
      <UserAvatar
        className="size-12 border-2 border-border"
        fallbackClassName="text-2xl"
        name={user.username}
        src={user.profilePicture}
      />

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
