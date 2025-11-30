"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProfileDrawer } from "@/components/chat/drawer";
import { Divisor } from "@/components/divisor";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector } from "@/providers/store/hooks";
import { AppRoutesEnum } from "@/shared/route";
import { getNameInitials } from "@/utils/text-helpers";
import { SCROLL_THRESHOLD } from "./constants";
import { headerVariants } from "./styles";
import type { IHeaderRenderProps, ISafeUserType } from "./types";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentSelectorUser = useAppSelector((state) => state.user);

  const { currentUserData } = currentSelectorUser;

  const currentUserInfo: ISafeUserType | null = currentUserData
    ? {
      _id: String(currentUserData._id || ""),
      clerkUserId: currentUserData.clerkUserId ?? null,
      name: currentUserData.name ?? "",
      email: currentUserData.email ?? "",
      profilePicture: currentUserData?.profilePicture,
      createdAt: currentUserData.createdAt,
    }
    : null;

  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!currentUserInfo) {
    return (
      <header className={headerVariants({ sticky: isSticky })}>
        <div className="mx-auto flex max-w-6xl items-center justify-end px-6 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </header>
    );
  }

  const headerProps: IHeaderRenderProps = {
    isSticky,
    isDrawerOpen,
    onDrawerOpenChange: setIsDrawerOpen,
  };

  return (
    <header className={headerVariants({ sticky: isSticky })}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href={AppRoutesEnum.CHAT}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Logo className="h-6 w-auto md:mr-48" />
        </Link>

        <div className="hidden md:flex">
          <Sheet
            open={headerProps.isDrawerOpen}
            onOpenChange={headerProps.onDrawerOpenChange}
          >
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-3 cursor-pointer select-none"
                aria-label="Abrir menu do usuário"
                type="button"
              >
                <span className="font-medium leading-none">
                  {currentUserInfo?.name || ""}
                </span>

                <Divisor />

                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={currentUserInfo?.profilePicture ?? ""} />
                  <AvatarFallback>
                    {getNameInitials({ text: currentUserInfo?.name })}
                  </AvatarFallback>
                </Avatar>
              </button>
            </SheetTrigger>

            <ProfileDrawer
              closeDrawer={() => headerProps.onDrawerOpenChange(false)}
              name={currentUserInfo?.name ?? ""}
              userId={String(currentUserInfo?._id)}
              avatarUrl={currentUserInfo?.profilePicture || undefined}
              registrationDate={String(currentUserInfo?.createdAt)}
            />
          </Sheet>
        </div>

        <div className="flex md:hidden">
          <Sheet
            open={headerProps.isDrawerOpen}
            onOpenChange={headerProps.onDrawerOpenChange}
          >
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-2 cursor-pointer select-none"
                aria-label="Abrir menu do usuário"
                type="button"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUserInfo?.profilePicture ?? ""} />
                  <AvatarFallback>
                    {getNameInitials({ text: currentUserInfo?.name })}
                  </AvatarFallback>
                </Avatar>

                <Divisor className="hidden md:block" />

                <span className="hidden md:block font-medium text-sm leading-none truncate max-w-[120px]">
                  {getNameInitials({ text: currentUserInfo?.name })}
                </span>
              </button>
            </SheetTrigger>

            <ProfileDrawer
              closeDrawer={() => headerProps.onDrawerOpenChange(false)}
              name={currentUserInfo?.name ?? ""}
              userId={String(currentUserInfo?._id)}
              avatarUrl={currentUserInfo?.profilePicture || undefined}
              registrationDate={String(currentUserInfo?.createdAt || "")}
            />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
