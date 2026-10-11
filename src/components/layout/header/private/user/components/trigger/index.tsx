import { forwardRef } from "react";
import { UserAvatar } from "@/components/chat/avatar";
import { Divisor } from "@/components/divisor";
import type { IUserMenuTriggerProps } from "./types";

export const UserMenuTrigger = forwardRef<
  HTMLButtonElement,
  IUserMenuTriggerProps
>(({ name, profilePicture, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className="flex items-center gap-3 cursor-pointer select-none hover:opacity-80 transition-opacity"
      aria-label="Abrir menu do usuário"
      type="button"
      {...props}
    >
      <span className="hidden items-center gap-3 md:flex">
        <span className="font-medium leading-none">{name}</span>
        <Divisor />
      </span>

      <UserAvatar className="h-9 w-9" name={name} src={profilePicture} />
    </button>
  );
});

UserMenuTrigger.displayName = "UserMenuTrigger";
