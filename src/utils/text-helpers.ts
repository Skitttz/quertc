const getNameInitials = ({ text }: { text: string | undefined }) => {
  if (!text || text.trim().length === 0) return "";

  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export { getNameInitials };
