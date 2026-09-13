import type { ResultGraphic, ResultTone } from "@/types/theme";

const fillClass: Record<ResultTone, string> = {
  default: "bg-slate-700",
  positive: "bg-teal-600",
  warning: "bg-amber-500",
  negative: "bg-rose-500",
  accent: "bg-sky-600",
};

type ResultMeterProps = {
  graphic: ResultGraphic;
  tone?: ResultTone;
};

export function ResultMeter({
  graphic,
  tone = "default",
}: ResultMeterProps) {
  const ratio = Math.min(1, Math.max(0, graphic.ratio));
  const mark =
    graphic.mark === undefined
      ? null
      : Math.min(1, Math.max(0, graphic.mark));

  if (graphic.origin === "center") {
    const fromCenter = ratio - 0.5;
    const width = Math.abs(fromCenter) * 100;
    const left = fromCenter >= 0 ? 50 : 50 - width;

    return (
      <div
        className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100"
        aria-hidden
      >
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
        <div
          className={`absolute inset-y-0 rounded-full transition-[left,width] duration-150 ease-out ${fillClass[tone]}`}
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        {mark !== null ? (
          <div
            className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-slate-900/70"
            style={{ left: `${mark * 100}%` }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100"
      aria-hidden
    >
      <div
        className={`h-full rounded-full transition-[width] duration-150 ease-out ${fillClass[tone]}`}
        style={{ width: `${ratio * 100}%` }}
      />
      {mark !== null ? (
        <div
          className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-slate-900/70"
          style={{ left: `${mark * 100}%` }}
        />
      ) : null}
    </div>
  );
}
