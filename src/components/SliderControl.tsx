"use client";

import { formatSliderValue } from "@/lib/format";
import type { SliderConfig } from "@/types/simulation";
import type { SliderSpec } from "@/types/theme";

type SliderControlProps = {
  config: SliderSpec | SliderConfig;
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
};

export function SliderControl({
  config,
  value,
  onChange,
  compact = false,
}: SliderControlProps) {
  const display = formatSliderValue(value, config.unit, config.step);
  const percent =
    ((value - config.min) / (config.max - config.min)) * 100;

  return (
    <div
      className={
        compact
          ? "min-h-0 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-sm shadow-slate-200/30"
          : "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"
      }
    >
      <div
        className={
          compact
            ? "mb-0.5 flex items-center justify-between gap-2"
            : "mb-3 flex items-end justify-between gap-3"
        }
      >
        <label
          htmlFor={`slider-${config.key}`}
          className={
            compact
              ? "text-xs font-semibold tracking-wide text-slate-700"
              : "text-sm font-semibold tracking-wide text-slate-700"
          }
        >
          {config.label}
        </label>
        <span
          className={
            compact
              ? "font-display text-lg font-semibold tabular-nums tracking-tight text-slate-900 sm:text-xl"
              : "font-display text-3xl font-semibold tabular-nums tracking-tight text-slate-900 transition-colors duration-200"
          }
          aria-live="polite"
        >
          {display}
        </span>
      </div>

      <div
        className={
          compact
            ? "flex items-center gap-2 text-[10px] font-medium text-slate-400"
            : "mb-2 flex items-center gap-3 text-xs font-medium text-slate-400"
        }
      >
        <span className={compact ? "hidden sm:inline" : undefined}>
          {config.lowLabel}
        </span>
        <div className="relative flex-1">
          <div className={compact ? "h-1.5 rounded-full bg-slate-100" : "h-2 rounded-full bg-slate-100"}>
            <div
              className={
                compact
                  ? "h-1.5 rounded-full bg-teal-600/80 transition-[width] duration-150 ease-out"
                  : "h-2 rounded-full bg-teal-600/80 transition-[width] duration-150 ease-out"
              }
              style={{ width: `${percent}%` }}
            />
          </div>
          <input
            id={`slider-${config.key}`}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            aria-label={`${config.label}: ${display}`}
            aria-valuemin={config.min}
            aria-valuemax={config.max}
            aria-valuenow={value}
            aria-valuetext={display}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 top-1/2 h-10 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent accent-teal-700"
          />
        </div>
        <span className={compact ? "hidden sm:inline" : undefined}>
          {config.highLabel}
        </span>
      </div>

      {compact ? null : (
        <>
          <div className="mt-3 flex justify-between text-[11px] tabular-nums text-slate-400">
            <span>
              {formatSliderValue(config.min, config.unit, config.step)}
            </span>
            <span>
              {formatSliderValue(config.max, config.unit, config.step)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {config.description}
          </p>
        </>
      )}
    </div>
  );
}
