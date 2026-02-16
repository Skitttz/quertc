import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_IDS } from "../constants";
import { ChatPreview3D } from "./components/preview";
import { heroStyles } from "./styles";

export function Hero() {
  const { container, badge, title, subtitle, buttons, preview } = heroStyles();

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-2 md:pt-12 overflow-hidden"
      id={LANDING_IDS.HERO}
    >
      <div className={container()}>
        <div className="flex flex-col gap-1">
          <div className={badge()}>
            <MessageSquare />
            <label htmlFor="realtime">Chat em tempo real</label>
          </div>

          <div className="space-y-2">
            <h1 className={title()}>
              Converse, compartilhe e descubra novas ideias
            </h1>
            <p className={subtitle()}>
              Um chat rápido e moderno para quem quer se comunicar sem
              complicação.
            </p>
          </div>
        </div>

        <div className={buttons()}>
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
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
            >
              Saiba mais
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center italic">
            Leva menos de 1 minuto para começar!
          </p>
        </div>
      </div>

      <div className={preview()}>
        <div className="aspect-video rounded-xl relative animate-float w-full">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-border via-border/40 to-transparent" />

          <div className="absolute inset-[1px] rounded-[calc(theme(borderRadius.xl)-1px)] bg-card/60 backdrop-blur-sm overflow-hidden">
            <ChatPreview3D />
          </div>
        </div>
      </div>
    </section>
  );
}
