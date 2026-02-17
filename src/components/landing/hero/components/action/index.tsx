"use client";
import { useRouter } from "next/navigation";
import { NAVIGATION_LINKS } from "@/components/layout/header/public/constants";
import { Button } from "@/components/ui/button";
import { AppRoutesEnum } from "@/shared/route";
import { heroStyles } from "../../styles";

export function HeroAction() {
  const { buttons } = heroStyles();
  const { push } = useRouter();
  const handleEventLinkMoreAbout = ({
    event,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
  }) => {
    event.preventDefault();
    const target = document.getElementById(NAVIGATION_LINKS[2].href);
    if (!target) return;
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
  return (
    <div className={buttons()}>
      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          onClick={() => push(AppRoutesEnum.SIGN_UP)}
          size="lg"
          variant="default"
          className="hover:bg-blue-800 shadow-md transition-all duration-200"
        >
          Experimente agora
        </Button>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          className="hover:bg-transparent transition-all duration-200"
          onClick={(event) => handleEventLinkMoreAbout({ event })}
        >
          Saiba mais
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center italic">
        Leva menos de 1 minuto para começar!
      </p>
    </div>
  );
}
