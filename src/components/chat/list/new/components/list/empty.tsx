import { Button } from "@/components/ui/button";

export function NewChatListUsersEmpty({
  action,
  description = "Parece que não há usuários disponíveis para iniciar uma nova conversa.",
  title = "Não encontramos ninguém por aqui",
}: {
  action?: { label: string; onClick: () => void };
  description?: string;
  title?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <span className="text-xl font-semibold">{title}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
