"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useAppSelector } from "@/providers/store/hooks";
import { AppRoutesEnum } from "@/shared/route";
import { SCROLL_THRESHOLD } from "./constants";
import { headerVariants } from "./styles";
import type { ISafeUserType } from "./types";
import { UserMenu } from "./user/components/menu";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
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

  useEffect(() => {
    if (currentUserInfo?.profilePicture) {
      setAvatarUrl(currentUserInfo.profilePicture);
    }
  }, [currentUserInfo?.profilePicture]);

  const handleAvatarChange = useCallback((newAvatarUrl: string) => {
    setIsAvatarLoading(true);
    setAvatarUrl(newAvatarUrl);
  }, []);

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

  const userMenuProps = {
    isOpen: isDrawerOpen,
    onOpenChange: setIsDrawerOpen,
    name: currentUserInfo.name,
    userId: String(currentUserInfo._id),
    profilePicture: avatarUrl || currentUserInfo.profilePicture || "",
    registrationDate: String(currentUserInfo.createdAt),
    onAvatarChange: handleAvatarChange,
    isAvatarLoading,
    onAvatarLoaded: () => setIsAvatarLoading(false),
  };

  return (
    <header className={headerVariants({ sticky: isSticky })}>
      <div className="flex items-center justify-between px-6 py-3">
        <Link
          href={AppRoutesEnum.CHAT}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Logo className="h-6 w-auto md:mr-48" />
        </Link>

        <div className="hidden md:flex">
          <UserMenu {...userMenuProps} variant="desktop" />
        </div>

        <div className="flex md:hidden">
          <UserMenu {...userMenuProps} variant="mobile" />
        </div>
      </div>
    </header>
  );
}
