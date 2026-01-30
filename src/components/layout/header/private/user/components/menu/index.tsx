import { ProfileDrawer } from "@/components/chat/drawer";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { UserMenuTrigger } from "../trigger";
import type { IUserMenuProps } from "./types";

export function UserMenu({
  isOpen,
  onOpenChange,
  name,
  userId,
  profilePicture,
  registrationDate,
  variant,
  onAvatarChange,
  onAvatarLoaded,
  isAvatarLoading,
}: IUserMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <UserMenuTrigger
          name={name}
          profilePicture={profilePicture}
          variant={variant}
        />
      </SheetTrigger>

      <ProfileDrawer
        closeDrawer={() => onOpenChange(false)}
        name={name}
        userId={userId}
        defaultAvatar={profilePicture}
        registrationDate={registrationDate}
        onAvatarChange={onAvatarChange}
        onAvatarLoaded={onAvatarLoaded}
        isAvatarLoading={isAvatarLoading}
      />
    </Sheet>
  );
}
