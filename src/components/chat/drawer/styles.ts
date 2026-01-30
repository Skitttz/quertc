import { tv } from "tailwind-variants";

const drawerStyles = tv({
  slots: {
    icon: "w-4 h-4 text-muted-foreground mt-0.5",
    avatarOverlay:
      "absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity",
  },

  variants: {
    overlayVisible: {
      true: {
        avatarOverlay: "opacity-100",
      },
      false: {
        avatarOverlay: "opacity-0 group-hover:opacity-100",
      },
    },
  },

  defaultVariants: {
    overlayVisible: false,
  },
});

export { drawerStyles };
