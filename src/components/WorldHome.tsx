import Link from "next/link";
import { featuredEras, worldIdsForEra } from "@/lib/eras";
import { THEME_METAS, getThemeMeta } from "@/lib/themes/catalog";

export function WorldHome() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-teal-800 uppercase">
          Slider
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          スライダー
        </h1>
        <p className="mt-4 font-display text-xl text-slate-700 sm:text-2xl">
          世界を、触って理解する。
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
          世の中の仕組みは、説明を読むより先に、数字を動かしたほうが残る。
          金利、給料、為替、通勤、電気代。いまの数字だけでなく、過去の時代にも飛ばせる。
        </p>
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            1本のとき
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-slate-900">
            変数は一つでいい
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            通勤時間だけ動かす。片道15分の差が、1年で何十時間になるかが、すぐ目に入る。
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            複数のとき
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-slate-900">
            パラメーターは互いに影響する
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            給料を上げても、物価が先に走れば実質は減る。円安は輸出を助け、家計を同時に叩く。
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              動かす世界
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              気になる問いを選ぶ。スライダーを動かした瞬間に、右側が変わる。
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {THEME_METAS.map((theme) => (
            <Link
              key={theme.id}
              href={`/worlds/${theme.id}`}
              className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:border-teal-700/25 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.18em] text-teal-800 uppercase">
                  {theme.number} · {theme.domain}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {theme.interaction === "single"
                    ? "スライダー 1本"
                    : `${theme.sliderCount}本が相互に影響`}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-slate-950 group-hover:text-teal-900">
                {theme.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {theme.teaser}
              </p>
              <p className="mt-4 text-sm font-medium text-teal-800">
                この世界を動かす →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              時代を歩く
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              当時のスライダー位置に飛ばして、いまとの差を見る。
            </p>
          </div>
          <Link
            href="/eras"
            className="text-sm font-medium text-teal-800 hover:text-teal-950"
          >
            すべての時代 →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredEras().map((era) => (
            <article
              key={era.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <p className="font-display text-2xl font-semibold tabular-nums text-slate-950">
                {era.year}
              </p>
              <h3 className="mt-1 font-semibold text-slate-900">{era.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {era.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {worldIdsForEra(era).map((worldId) => {
                  const theme = getThemeMeta(worldId);
                  if (!theme) return null;
                  return (
                    <Link
                      key={worldId}
                      href={`/worlds/${worldId}?era=${era.id}`}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                    >
                      {theme.title}
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
