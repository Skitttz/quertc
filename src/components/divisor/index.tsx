import { cn } from "@/lib/utils";

export function Divisor({ className }: { className?: string }) {
  return <div className={cn("h-6 w-px bg-border rounded-full", className)} />;
}
