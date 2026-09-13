export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSigned(value: number, digits = 0): string {
  const abs = formatNumber(Math.abs(value), digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `-${abs}`;
  return abs;
}

export function formatPercent(value: number, digits = 1): string {
  return `${formatNumber(value, digits)}%`;
}

export function formatMultiple(value: number, digits = 0): string {
  return `${formatNumber(value, digits)}倍`;
}

export function formatSliderValue(
  value: number,
  unit: string,
  step: number,
): string {
  const digits = step < 1 ? 1 : 0;
  const formatted = formatNumber(value, digits);
  return unit === "%" ? `${formatted}%` : `${formatted}${unit}`;
}
