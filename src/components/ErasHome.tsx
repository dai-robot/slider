import Link from "next/link";
import { ERA_MOMENTS, worldIdsForEra } from "@/lib/eras";
import { getThemeMeta } from "@/lib/themes/catalog";

export function ErasHome() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-teal-800 uppercase">
          Timeline
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          時代を歩く
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
          同じスライダーでも、1974年と2024年では世界の形が違う。
          当時の数字に飛ばして、いまとの差を見る。
        </p>
      </header>

      <ol className="mt-12 space-y-4">
        {ERA_MOMENTS.map((era) => {
          const worlds = worldIdsForEra(era);
          return (
            <li
              key={era.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="font-display text-3xl font-semibold tabular-nums text-slate-950">
                  {era.year}
                </p>
                <h2 className="font-display text-xl font-semibold text-slate-900">
                  {era.title}
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {era.summary}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {era.source}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {worlds.map((worldId) => {
                  const theme = getThemeMeta(worldId);
                  if (!theme) return null;
                  return (
                    <Link
                      key={worldId}
                      href={`/worlds/${worldId}?era=${era.id}`}
                      className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-teal-700/40 hover:bg-teal-50 hover:text-teal-900"
                    >
                      {theme.title}
                    </Link>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
