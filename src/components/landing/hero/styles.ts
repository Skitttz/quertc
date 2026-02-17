import { tv } from "tailwind-variants";

export const heroStyles = tv({
  slots: {
    container: "max-w-6xl mx-auto text-center space-y-8 animate-fade-in-slow",
    badge:
      "hidden md:flex items-center justify-center gap-2 text-sm text-muted-foreground border border-border/60 bg-card/60 backdrop-blur py-2 px-4 rounded-2xl w-fit mx-auto animate-slide-down opacity-0 shadow-sm",
    title:
      "text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight leading-[1.15] md:leading-[1.1] animate-fade-up opacity-0 max-w-sm md:max-w-2xl lg:max-w-4xl",
    subtitle:
      "text-base md:text-xl text-muted-foreground max-w-2xl mx-auto pt-2 md:pt-0 animate-fade-up opacity-0 delay-200",
    buttons:
      "flex flex-col items-center justify-center gap-3 pt-2 md:pt-7 animate-fade-up opacity-0 delay-300",
    preview: "w-full max-w-2xl mx-auto mt-16 animate-fade-in delay-500 pb-12",
  },
});
