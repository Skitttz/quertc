import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export interface IItemInfoProps {
  name: string;
  value: string;
  icon?: ReactNode;
  tooltip?: {
    content: ReactNode;
    side?: TooltipContentProps["side"];
  };
}
