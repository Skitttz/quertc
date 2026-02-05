export function NewChatListUsersShimmer({ length }: { length?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: length ?? 3 }).map((_, index) => (
        <div
          key={`new-chat-list-empty-state-${index + 1}`}
          className="h-10 animate-pulse rounded-md bg-muted"
        />
      ))}
    </div>
  );
}
