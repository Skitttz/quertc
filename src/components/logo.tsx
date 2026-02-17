import { MessageSquareCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-foreground",
        className,
      )}
      {...props}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <MessageSquareCode size={16} />
      </span>
      <span className="text-xl font-semibold tracking-tight">
        <span>Quer</span>
        <span className="text-primary lowercase">tc</span>
      </span>
    </div>
  );
}
