export function NewChatListUsersEmpty({
  description = "Parece que não há usuários disponíveis para iniciar uma nova conversa.",
}: {
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <span className="text-xl font-semibold">
        Não encontramos ninguém por aqui
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
  );
}
