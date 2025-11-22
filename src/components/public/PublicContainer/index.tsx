import { Header } from "@/components/layout/header/public";
import { cn } from "@/lib/utils";
import type { IPublicContainerProps } from "./types";

export function PublicContainer({
  children,
  classNames,
}: IPublicContainerProps) {
  return (
    <div
      className={cn("flex flex-col min-h-screen w-full", classNames?.container)}
    >
      <Header />
      <div className={cn("pt-16 flex flex-col gap-16 px-6 max-w-7xl mx-auto w-full flex-1", classNames?.content)}>
        {children}
      </div>
    </div>
  );
}
