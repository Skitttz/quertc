const getNameInitials = ({ text }: { text: string | undefined }) => {
  if (!text || text.trim().length === 0) return "";

  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const toDocumentAnchorId = (text: string) => `#${text}`;

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export { getNameInitials, normalizeText, toDocumentAnchorId };
