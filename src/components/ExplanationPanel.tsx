type ExplanationPanelProps = {
  explanation: string;
  learningPoint: string;
  compact?: boolean;
};

export function ExplanationPanel({
  explanation,
  learningPoint,
  compact = false,
}: ExplanationPanelProps) {
  if (compact) {
    return (
      <section className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm shadow-slate-200/30">
        <p className="line-clamp-2 text-xs leading-snug text-slate-600" aria-live="polite">
          {explanation}
        </p>
        <p
          className="line-clamp-2 text-xs font-medium leading-snug text-slate-900"
          aria-live="polite"
        >
          <span className="mr-1 font-semibold tracking-wider text-teal-700 uppercase">
            学び
          </span>
          {learningPoint}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            なぜこうなる？
          </h2>
          <p
            className="mt-3 text-base leading-relaxed text-slate-600"
            aria-live="polite"
          >
            {explanation}
          </p>
        </div>
        <aside className="rounded-2xl bg-slate-900 px-5 py-5 text-white">
          <p className="text-xs font-semibold tracking-wider text-teal-300 uppercase">
            きょうの学び
          </p>
          <p
            className="mt-3 font-display text-lg font-medium leading-snug sm:text-xl"
            aria-live="polite"
          >
            {learningPoint}
          </p>
        </aside>
      </div>
    </section>
  );
}
