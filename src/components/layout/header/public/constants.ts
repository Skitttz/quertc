import { LANDING_IDS } from "@/components/landing/constants";

const NAVIGATION_LINKS = [
  {
    label: "Sobre",
    href: LANDING_IDS.ABOUT,
    isInternal: true,
  },
  {
    label: "Blog",
    href: "/blog",
    isInternal: false,
  },
  {
    label: "Funcionalidades",
    href: LANDING_IDS.FEATURES,
    isInternal: true,
  },
] as const;

const SCROLL_THRESHOLD = 10;

export { NAVIGATION_LINKS, SCROLL_THRESHOLD };
