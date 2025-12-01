export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Formats large numbers in compact notation (K for thousands, M for millions)
 * @param value - The number to format
 * @param includeSymbol - Whether to include $ symbol (default: false)
 * @returns Formatted string like "1.4M" or "$350K"
 */
export const formatCompactNumber = (
  value: number,
  includeSymbol = false
): string => {
  const absValue = Math.abs(value);
  const symbol = includeSymbol ? "$" : "";

  if (absValue >= 1000000) {
    const millions = value / 1000000;
    return `${symbol}${millions.toFixed(absValue >= 10000000 ? 0 : 1)}M`;
  } else if (absValue >= 1000) {
    const thousands = value / 1000;
    return `${symbol}${thousands.toFixed(absValue >= 100000 ? 0 : 1)}K`;
  } else {
    return `${symbol}${value.toLocaleString()}`;
  }
};
