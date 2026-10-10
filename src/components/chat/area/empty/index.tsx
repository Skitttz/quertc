import { MessageCircleCode } from "lucide-react";

export function ChatAreaEmpty() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <MessageCircleCode size={48} className="text-5xl text-primary" />

      <h2 className="text-lg font-semibold text-foreground">
        Nenhuma conversa selecionada
      </h2>

      <p className="max-w-sm text-sm">
        Selecione uma conversa ao lado para visualizar ou crie uma nova.
      </p>
    </div>
  );
}
