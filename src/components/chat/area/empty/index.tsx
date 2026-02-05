import { MessageCircleCode } from "lucide-react";

export function ChatAreaEmpty() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-gray-500">
    <MessageCircleCode size={48} className="text-5xl text-blue-600"/>

      <h2 className="text-lg font-semibold text-gray-700">
        Nenhuma conversa selecionada
      </h2>

      <p className="max-w-sm text-sm">
        Selecione uma conversa ao lado para visualizar ou crie uma nova.
      </p>
    </div>
  )
}
