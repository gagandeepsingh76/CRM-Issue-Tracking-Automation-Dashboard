export const formatEnum = (value) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Unassigned";

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en-US").format(new Date(value)) : "Not set";

export const formatPercent = (value) => `${Math.round(Number(value ?? 0))}%`;
