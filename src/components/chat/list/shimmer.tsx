export function ChatListShimmer() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`${index + 1}`}
          className="flex items-center gap-3 rounded-md p-2 animate-pulse"
        >
          <div className="h-12 w-12 rounded-full bg-muted" />

          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
