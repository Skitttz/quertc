"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AppRoutesEnum } from "@/shared/route";
import { NAVIGATION_LINKS, SCROLL_THRESHOLD } from "./constants";
import { headerVariants, mobileMenuVariants, navLinkVariants } from "./styles";
import type { DeviceType, IHeaderRenderProps } from "./types";

export function Header() {
  const { isMobile, isDesktop } = useMediaQuery();
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isDesktop, isMenuOpen]);

  const handleLinkClick = () => setIsMenuOpen(false);

  const currentDevice: DeviceType = isMobile ? "mobile" : "desktop";

  const headerMap: Record<
    DeviceType,
    (props: IHeaderRenderProps) => ReactNode
  > = {
    desktop: () => (
      <Fragment>
        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              {NAVIGATION_LINKS.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={navLinkVariants({ variant: "desktop" })}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex gap-3 flex-shrink-0">
          <Button variant="ghost" asChild>
            <Link href={AppRoutesEnum.SIGN_IN}>Entrar</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href={AppRoutesEnum.SIGN_UP}>Começar grátis</Link>
          </Button>
        </div>
      </Fragment>
    ),

    mobile: (props) => (
      <Popover open={props.isMenuOpen} onOpenChange={props.onMenuOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="md:hidden flex-shrink-0 cursor-pointer"
            aria-label={props.isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {props.isMenuOpen ? (
              <X className={mobileMenuVariants().icon()} />
            ) : (
              <Menu className={mobileMenuVariants().icon()} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className={mobileMenuVariants({ hasButtons: true }).base()}
        >
          <nav className="flex flex-col-reverse">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={props.handleLinkClick}
                className={navLinkVariants({ variant: "mobile" })}
              >
                {link.label} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            ))}
            <div className="flex flex-col gap-3 bg-gray-50 py-4 px-3 border-b overflow-hidden">
              <Button variant="ghost" asChild className="w-full justify-start border pt-2">
                <Link href={AppRoutesEnum.SIGN_IN} onClick={props.handleLinkClick}>
                  Entrar
                </Link>
              </Button>
              <Button
                variant="default"
                asChild
                className="w-full justify-start"
              >
                <Link href={AppRoutesEnum.SIGN_UP} onClick={props.handleLinkClick}>
                  Começar grátis
                </Link>
              </Button>
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    ),
  };

  const renderProps: IHeaderRenderProps = {
    isSticky,
    isMenuOpen,
    onMenuOpenChange: setIsMenuOpen,
    handleLinkClick,
  };

  return (
    <header className={headerVariants({ sticky: isSticky })}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Logo className="h-6 w-auto md:mr-48" />
        </Link>

        {headerMap[currentDevice](renderProps)}
      </div>
    </header>
  );
}
