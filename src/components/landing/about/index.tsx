import Image from "next/image";
import { LANDING_IDS } from "../constants";

export function About() {
  return (
    <section
      className="px-0 md:px-6 py-12 max-w-7xl mx-auto"
      id={LANDING_IDS.ABOUT}
    >
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Sobre nós
          </h2>
          <p className="text-muted-foreground">
            A Quertc nasceu de uma ideia simples: conversas boas aproximam
            pessoas e resolvem problemas. Criamos um chat leve, com visual
            familiar e atenção aos detalhes — do primeiro envio ao último
            “obrigado”.
          </p>
          <p className="text-muted-foreground">
            Nosso foco é unir rapidez com um toque humano: mensagens fluem, o
            status de leitura traz segurança, e cada interação parece natural.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              Sem fricção
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              Prioridade na Experiência
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              Cuidado com detalhes
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border">
          <Image
            src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
            alt="Pessoas se comunicando e colaborando"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
