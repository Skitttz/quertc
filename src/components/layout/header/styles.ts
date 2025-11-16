import { tv, type VariantProps } from "tailwind-variants";

const headerVariants = tv({
  base: "top-0 left-0 w-full z-50 transition-all duration-300",
  variants: {
    sticky: {
      true: "sticky w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-xs border-b",
      false: "sticky w-full bg-transparent border-b border-b-transparent",
    },
  },
  defaultVariants: {
    sticky: false,
  },
});

const navLinkVariants = tv({
  base: "text-sm font-normal transition-colors duration-200 flex justify-between items-center hover:bg-transparent",
  variants: {
    variant: {
      desktop: "text-gray-600 hover:text-gray-900",
      mobile:
        "px-4 py-3 text-gray-700 hover:bg-gray-100 border-b last:border-b-0",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

const mobileMenuVariants = tv({
  slots: {
    base: "w-48 mt-4 overflow-hidden",
    icon: "size-6",
  },
  variants: {
    hasButtons: {
      true: "p-0 flex flex-col divide-y divide-gray-200",
      false: "p-2 flex flex-col space-y-2",
    },
  },
  defaultVariants: {
    hasButtons: true,
    icon: "",
  },
});

type HeaderVariants = VariantProps<typeof headerVariants>;
type NavLinkVariants = VariantProps<typeof navLinkVariants>;
type MobileMenuVariants = VariantProps<typeof mobileMenuVariants>;

export {
  mobileMenuVariants,
  headerVariants,
  navLinkVariants,
  type HeaderVariants,
  type MobileMenuVariants,
  type NavLinkVariants,
};
