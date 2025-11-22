import { useEffect, useState } from "react";

export function useMediaQuery({
  customBreakpoint,
}: {
  customBreakpoint?: number;
} = {}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const breakpoint = customBreakpoint ?? 768;

    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);

    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [customBreakpoint]);

  return {
    isMobile,
    isDesktop: !isMobile,
    ready: isMobile !== null,
  };
}
