import { tv } from "tailwind-variants";

export const featuresStyles = tv({
  slots: {
    container: "grid grid-cols-1 md:grid-cols-3 gap-6",
    card: "border-snake rounded-lg animate-scale-in group bg-gradient-to-b from-accent/10 via-card/60 to-card/30 border border-accent/30 hover:border-accent/60 hover:shadow-[0_0_20px_-5px_hsl(var(--accent))] backdrop-blur-md transition-all duration-300",
    content: "flex flex-col items-start px-6 space-y-4",
    iconWrapper:
      "w-12 h-12 rounded-lg bg-transparent border flex items-center justify-center group-hover:bg-primary transition-colors",
    icon: "w-6 h-6 text-accent-foreground group-hover:text-primary-foreground transition-colors bg-transparent",
    title: "text-xl font-semibold text-lg text-accent-foreground mt-3",
    description: "text-sm text-muted-foreground leading-relaxed",
  },
});
