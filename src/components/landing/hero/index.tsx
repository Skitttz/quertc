import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LANDING_IDS } from "../constants";
import { HeroAction } from "./components/action";
import { ChatPreview } from "./components/preview";
import { heroStyles } from "./styles";

export function Hero() {
  const { container, badge, title, subtitle, preview } = heroStyles();

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-0 md:px-6 pt-2 md:pt-12 overflow-hidden"
      id={LANDING_IDS.HERO}
    >
      <div className={container()}>
        <div className="flex flex-col gap-4 md:gap-1">
          <div className={badge()}>
            <MessageSquare />
            <label htmlFor="realtime">Chat em tempo real</label>
          </div>

          <div className="space-y-3">
            <h1 className={title()}>
              Converse, compartilhe e descubra novas ideias
            </h1>
            <p className={subtitle()}>
              Um chat rápido e moderno para quem quer se comunicar sem
              complicação.
            </p>
          </div>
        </div>

        <HeroAction />
      </div>

      <div className={preview()}>
        <div className="aspect-[9/16] sm:aspect-[4/3] md:aspect-video rounded-2xl relative animate-float w-full ring-1 ring-border/60">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-border/80 via-border/30 to-transparent" />

          <div className="absolute inset-[1px] rounded-[calc(theme(borderRadius.2xl)-1px)] bg-card/40 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 py-4 border-b border-border/60 bg-card/60">
              <div className="flex items-center gap-3 py-4">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px]">AC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-foreground">
                    Ana Clara
                  </span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"></div>
            </div>

            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
