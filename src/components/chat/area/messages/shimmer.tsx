export function ChatMessagesShimmer() {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`${index + 1}`}
          className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}
