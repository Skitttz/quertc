"use client";

import { useEffect, useState } from "react";
import { searchMessages } from "@/actions/message";
import { MESSAGE_SEARCH_MIN_LENGTH } from "@/actions/message/constants";
import type { IMessage } from "@/interfaces/message";

const SEARCH_DEBOUNCE_MS = 300;

export function useMessageSearch(query: string) {
  const [results, setResults] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < MESSAGE_SEARCH_MIN_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const messages = await searchMessages({ query });
        if (!cancelled) setResults(messages);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return { results, loading };
}
