import { LANDING_IDS } from "@/components/landing/constants";
import { AppRoutesEnum } from "@/shared/route";
import { toDocumentAnchorId } from "@/utils/text-helpers";

const COMPANY_LINKS = [
  {
    label: "Sobre",
    href: toDocumentAnchorId(LANDING_IDS.ABOUT),
    isRedirect: false,
  },
  { label: "Blog", href: AppRoutesEnum.BLOG, isRedirect: true },
  { label: "Github", href: "https://github.com/Skitttz", isRedirect: true },
];
export { COMPANY_LINKS };
