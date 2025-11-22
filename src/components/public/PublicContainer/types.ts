import type { ReactNode } from "react";

export interface IPublicContainerProps {
  children: ReactNode;
  classNames?: {
    container?: string;
    content?: string;
  };
}
