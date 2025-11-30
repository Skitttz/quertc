import type { SyntheticEvent } from "react";

const scrollTo = (e: SyntheticEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);

  if (element) {
    const startPosition = window.scrollY;
    const targetPosition = element.offsetTop - 60;
    const distance = targetPosition - startPosition;
    const duration = 1500;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
};

export { scrollTo };
