import type { ReactNode } from "react";

type PlayShellProps = {
  question: string;
  teaser: string;
  toolbar: ReactNode;
  sliders: ReactNode;
  results: ReactNode;
  status: ReactNode;
  chart: ReactNode;
  footer: ReactNode;
};

export function PlayShell({
  question,
  teaser,
  toolbar,
  sliders,
  results,
  status,
  chart,
  footer,
}: PlayShellProps) {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden px-3 py-2 sm:px-5 lg:px-8">
      <header className="shrink-0 pb-1.5">
        <h1 className="font-display text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
          {question}
        </h1>
        <p className="truncate text-xs text-slate-500 sm:text-sm">{teaser}</p>
      </header>

      <div className="shrink-0 pb-1.5">{toolbar}</div>

      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2 overflow-hidden sm:gap-3 lg:grid-cols-3 lg:grid-rows-1">
        <section
          aria-label="前提"
          className="flex min-h-0 flex-col justify-evenly gap-1 overflow-hidden"
        >
          {sliders}
        </section>
        <section
          aria-label="結果"
          className="flex min-h-0 flex-col gap-1.5 overflow-hidden"
        >
          {results}
          {status}
        </section>
        <section
          aria-label="グラフ"
          className="col-span-2 min-h-0 overflow-hidden lg:col-span-1"
        >
          {chart}
        </section>
      </div>

      <footer className="shrink-0 pt-1.5">{footer}</footer>
    </div>
  );
}
