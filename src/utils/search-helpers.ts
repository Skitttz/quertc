import { normalizeText } from "./text-helpers";

const ACCENT_VARIANTS: Record<string, string> = {
  a: "aáàâãä",
  c: "cç",
  e: "eéèêë",
  i: "iíìîï",
  n: "nñ",
  o: "oóòôõö",
  u: "uúùûü",
};

const SNIPPET_LEAD = 24;

const toAccentInsensitivePattern = (query: string) =>
  [...normalizeText(query)]
    .map((char) => {
      const variants = ACCENT_VARIANTS[char];
      if (variants) return `[${variants}${variants.toUpperCase()}]`;
      return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");

const getMatchSnippet = ({ text, query }: { text: string; query: string }) => {
  const index = normalizeText(text).indexOf(normalizeText(query));
  if (index === -1) return { before: text, match: "", after: "" };

  const start = index > SNIPPET_LEAD ? index - SNIPPET_LEAD : 0;

  return {
    before: `${start > 0 ? "…" : ""}${text.slice(start, index)}`,
    match: text.slice(index, index + query.length),
    after: text.slice(index + query.length),
  };
};

export { getMatchSnippet, toAccentInsensitivePattern };
