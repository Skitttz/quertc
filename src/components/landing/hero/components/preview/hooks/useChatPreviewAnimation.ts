"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_MESSAGES } from "../constants";
import type { MessageType } from "../types";

export function useChatPreviewAnimation() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const hasStartedRef = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scriptIndexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const check = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const visible =
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= vh &&
        rect.left <= vw &&
        rect.height > 0 &&
        rect.width > 0;
      if (visible) setIsVisible(true);
    };
    check();
    const onScroll = () => check();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runStep = () => {
      const script = DEFAULT_MESSAGES;
      if (!script.length) return;

      const currentIndex = scriptIndexRef.current;
      if (currentIndex >= script.length) {
        setDraft("");
        return;
      }

      const message = script[currentIndex];
      const fullText = message.lines.join(" ");

      const nextDelay = (prevChar: string | null) => {
        const base = 95;
        const jitter = Math.floor(Math.random() * 70);
        let extra = 0;
        if (prevChar === "." || prevChar === "!" || prevChar === "?")
          extra = 280;
        else if (prevChar === "," || prevChar === ";") extra = 160;
        else if (prevChar === " ") extra = 20;
        return base + jitter + extra;
      };

      if (message.received) {
        setDraft("");
        setIsTyping(true);
        timeoutRef.current = window.setTimeout(() => {
          setMessages((prev) => [...prev, message]);
          setIsTyping(false);
          const nextIndex = currentIndex + 1;
          scriptIndexRef.current = nextIndex;
          if (nextIndex < script.length) {
            timeoutRef.current = window.setTimeout(runStep, 1000);
          } else {
            timeoutRef.current = null;
          }
        }, 800);
      } else {
        let charIndex = 0;
        const typeNextChar = () => {
          if (charIndex <= fullText.length) {
            const slice = fullText.slice(0, charIndex);
            setDraft(slice);
            const prevChar = slice.slice(-1) ?? null;
            charIndex += 1;
            timeoutRef.current = window.setTimeout(
              typeNextChar,
              nextDelay(prevChar),
            );
          } else {
            setMessages((prev) => [...prev, message]);
            const nextIndex = currentIndex + 1;
            scriptIndexRef.current = nextIndex;
            setDraft("");
            if (nextIndex < script.length) {
              timeoutRef.current = window.setTimeout(runStep, 1400);
            } else {
              timeoutRef.current = null;
            }
          }
        };
        typeNextChar();
      }
    };

    timeoutRef.current = window.setTimeout(runStep, 400);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return {
    messages,
    draft,
    isTyping,
    isVisible,
    listRef,
    rootRef,
  };
}
