import { cn } from "@/lib/utils";

export function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-2xl", className)} {...props}>
      logo
    </h2>
  );
}
