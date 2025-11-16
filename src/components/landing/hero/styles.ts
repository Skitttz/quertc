import { tv } from "tailwind-variants";

export const heroStyles = tv({
  slots: {
    container: "max-w-6xl mx-auto text-center space-y-8 animate-fade-in-slow",
    badge:
      "flex items-center justify-center gap-2 text-sm text-muted-foreground border py-2 px-4 rounded-2xl w-fit mx-auto animate-slide-down opacity-0",
    title:
      "text-5xl md:text-7xl font-serif font-light tracking-tight leading-tight animate-fade-up opacity-0",
    subtitle:
      "text-xl text-muted-foreground max-w-2xl mx-auto  animate-fade-up opacity-0 delay-200",
    buttons:
      "flex flex-col items-center justify-center gap-3 pt-7 animate-fade-up opacity-0 delay-300",
    preview: "w-full max-w-5xl mx-auto mt-16 animate-fade-in delay-500",
  },
});
