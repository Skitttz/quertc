import { Divisor } from "@/components/divisor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/utils/text-helpers";
import { forwardRef } from "react";
import type { IUserMenuTriggerProps } from "./types";

export const UserMenuTrigger = forwardRef<
  HTMLButtonElement,
  IUserMenuTriggerProps
>(({ name, profilePicture, variant, ...props }, ref) => {
  const isDesktop = variant === "desktop";

  return (
    <button
      ref={ref}
      className="flex items-center gap-3 cursor-pointer select-none hover:opacity-80 transition-opacity"
      aria-label="Abrir menu do usuário"
      type="button"
      {...props}
    >
      {isDesktop && (
        <>
          <span className="font-medium leading-none">{name}</span>
          <Divisor />
        </>
      )}

      <Avatar className={isDesktop ? "h-9 w-9 flex-shrink-0" : "h-9 w-9"}>
        {profilePicture ? (
          <AvatarImage src={profilePicture} />
        ) : (
          <AvatarFallback>{getNameInitials({ text: name })}</AvatarFallback>
        )}
      </Avatar>
    </button>
  );
});

UserMenuTrigger.displayName = "UserMenuTrigger";
