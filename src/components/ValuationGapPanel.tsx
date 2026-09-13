import { formatMultiple, formatSigned } from "@/lib/format";
import type { CalculatedResult } from "@/types/simulation";

type ValuationGapProps = {
  peRatio: number;
  result: CalculatedResult;
};

function gapMessage(gap: number, label: string): string {
  if (gap >= 8) {
    return "現在のPERは、金利水準に対してかなり高めです";
  }
  if (gap >= 3) {
    return "現在のPERは、金利水準に対してやや高めです";
  }
  if (gap <= -8) {
    return "現在のPERは、金利水準に対してかなり低めです";
  }
  if (gap <= -3) {
    return "現在のPERは、金利水準に対してやや低めです";
  }
  return `現在のPERは、金利水準に対して${label}です`;
}

export function ValuationGapPanel({ peRatio, result }: ValuationGapProps) {
  const gap = result.valuationGap;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <h3 className="font-display text-lg font-semibold text-slate-900">
        金利から見た参考PER
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        ユーザー設定のPERと、金利ベースの簡易参考値を分けて表示します
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">あなたのPER</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-slate-900">
            {formatMultiple(peRatio, 0)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">参考PER</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-teal-800">
            {formatMultiple(result.referencePER, 0)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">差</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-slate-900">
            {formatSigned(gap, 0)}倍
          </p>
          <p className="mt-1 text-xs text-slate-500">{result.valuationLabel}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600" aria-live="polite">
        {gapMessage(gap, result.valuationLabel)}
      </p>
    </div>
  );
}
