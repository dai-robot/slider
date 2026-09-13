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
    <div className="mx-auto flex w-full max-w-6xl flex-col px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-2">
      <header className="shrink-0 pb-2 lg:pb-1.5">
        <h1 className="font-display text-base font-semibold tracking-tight text-slate-950 sm:text-xl">
          {question}
        </h1>
        <p className="mt-0.5 text-xs leading-snug text-slate-500 sm:truncate sm:text-sm">
          {teaser}
        </p>
      </header>

      <div className="-mx-3 shrink-0 overflow-x-auto overscroll-x-contain px-3 pb-2 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-1.5">
        {toolbar}
      </div>

      <div className="flex flex-col gap-3 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-1 lg:gap-3 lg:overflow-hidden">
        <section
          aria-label="前提"
          className="flex flex-col gap-2.5 lg:min-h-0 lg:justify-evenly lg:gap-1 lg:overflow-hidden"
        >
          {sliders}
        </section>
        <section
          aria-label="結果"
          className="flex flex-col gap-2 lg:min-h-0 lg:gap-1.5 lg:overflow-hidden"
        >
          {results}
          {status}
        </section>
        <section
          aria-label="グラフ"
          className="min-h-56 lg:min-h-0 lg:overflow-hidden"
        >
          {chart}
        </section>
      </div>

      <footer className="shrink-0 pt-3 lg:pt-1.5">{footer}</footer>
    </div>
  );
}
