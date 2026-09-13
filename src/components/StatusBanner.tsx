import type { ResultTone } from "@/types/theme";

type StatusBannerProps = {
  kicker?: string;
  title: string;
  description: string;
  tone?: ResultTone;
  compact?: boolean;
};

const toneClass: Record<ResultTone, string> = {
  default: "border-slate-200 bg-slate-50 text-slate-800",
  positive: "border-teal-200 bg-teal-50 text-teal-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  negative: "border-rose-200 bg-rose-50 text-rose-900",
  accent: "border-sky-200 bg-sky-50 text-sky-900",
};

export function StatusBanner({
  kicker = "いまの状態",
  title,
  description,
  tone = "default",
  compact = false,
}: StatusBannerProps) {
  if (compact) {
    return (
      <section
        className={`rounded-lg border px-2.5 py-1 ${toneClass[tone]}`}
        aria-live="polite"
      >
        <p className="truncate text-sm font-semibold tracking-tight">
          <span className="mr-1.5 text-[10px] font-semibold tracking-wider uppercase opacity-70">
            {kicker}
          </span>
          {title}
          <span className="ml-1.5 font-sans text-xs font-normal opacity-80">
            {description}
          </span>
        </p>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border p-5 ${toneClass[tone]}`} aria-live="polite">
      <p className="text-xs font-semibold tracking-wider uppercase opacity-70">
        {kicker}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed opacity-90">{description}</p>
    </section>
  );
}
