export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ratioInRange(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function stepDecimals(step: number): number {
  if (step >= 1) return 0;
  const text = step.toString();
  const index = text.indexOf(".");
  return index === -1 ? 1 : text.length - index - 1;
}

export function snapToStep(value: number, step: number): number {
  const snapped = Math.round(value / step) * step;
  return Number(snapped.toFixed(stepDecimals(step)));
}

export function snapValues(
  values: Record<string, number>,
  steps: Record<string, number>,
): Record<string, number> {
  const next: Record<string, number> = {};
  for (const [key, value] of Object.entries(values)) {
    next[key] = snapToStep(value, steps[key] ?? 1);
  }
  return next;
}
