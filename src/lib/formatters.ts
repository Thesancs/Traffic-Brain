export const formatCurrency = (value: number, includeSymbol = true) =>
  new Intl.NumberFormat("pt-BR", {
    style: includeSymbol ? "currency" : "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

export const formatDecimal = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
