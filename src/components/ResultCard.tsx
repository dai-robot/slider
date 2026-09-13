import { ResultMeter } from "@/components/ResultMeter";
import type { ResultGraphic, ResultTone } from "@/types/theme";

type ResultCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: ResultTone;
  compact?: boolean;
  graphic?: ResultGraphic;
};

const toneClass: Record<NonNullable<ResultCardProps["tone"]>, string> = {
  default: "text-slate-900",
  positive: "text-teal-800",
  warning: "text-amber-700",
  negative: "text-rose-700",
  accent: "text-sky-800",
};

export function ResultCard({
  label,
  value,
  hint,
  tone = "default",
  compact = false,
  graphic,
}: ResultCardProps) {
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-sm shadow-slate-200/30"
          : "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition-opacity duration-200"
      }
    >
      <p
        className={
          compact
            ? "text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
            : "text-xs font-semibold tracking-wider text-slate-500 uppercase"
        }
      >
        {label}
      </p>
      <p
        className={
          compact
            ? `mt-0.5 font-display text-lg font-semibold tabular-nums tracking-tight sm:text-xl ${toneClass[tone]}`
            : `mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl ${toneClass[tone]}`
        }
        aria-live="polite"
      >
        {value}
      </p>
      {graphic ? <ResultMeter graphic={graphic} tone={tone} /> : null}
      {hint ? (
        <p
          className={
            compact
              ? "mt-0.5 truncate text-[11px] text-slate-500"
              : "mt-2 text-sm leading-relaxed text-slate-500"
          }
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
