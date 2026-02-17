export function TypingDots() {
  return (
    <div className="flex w-full justify-start">
      <div className="inline-flex items-center gap-1.5 rounded-2xl bg-muted/70 px-3 py-1.5">
        <span
          className="inline-block size-1.5 rounded-full bg-muted-foreground/80 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="inline-block size-1.5 rounded-full bg-muted-foreground/80 animate-bounce"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="inline-block size-1.5 rounded-full bg-muted-foreground/80 animate-bounce"
          style={{ animationDelay: "240ms" }}
        />
      </div>
    </div>
  );
}

