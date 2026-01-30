type DateInput = Date | string | number | null | undefined;

const formatLongDatePtBr = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const toISOString = (value: DateInput) => {
  if (!value) return "";

  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

export { formatLongDatePtBr, toISOString };
