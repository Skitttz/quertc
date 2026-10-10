type DateInput = Date | string | number | null | undefined;

const formatLongDatePtBr = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatMessageTime = (date: string) => {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMessageDate = (date: string) => {
  const value = new Date(date);
  const isToday = value.toDateString() === new Date().toDateString();

  return isToday
    ? formatMessageTime(date)
    : value.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
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

export {
  formatLongDatePtBr,
  formatMessageDate,
  formatMessageTime,
  toISOString,
};
