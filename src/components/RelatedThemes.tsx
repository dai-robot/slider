"use client";

import Link from "next/link";
import { getRelatedThemes } from "@/lib/themes/catalog";

export function RelatedThemes({ currentId }: { currentId: string }) {
  const related = getRelatedThemes(currentId);

  return (
    <section className="mt-10">
      <h2 className="font-display text-lg font-semibold text-slate-900">
        別の世界を動かす
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        スライダーはテーマごとに本数が違う。1本の世界と、絡み合う世界を行き来してみる。
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((theme) => (
          <Link
            key={theme.id}
            href={`/worlds/${theme.id}`}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:border-teal-700/30 hover:bg-teal-50/40"
          >
            <p className="text-xs font-semibold tracking-wider text-teal-800 uppercase">
              {theme.domain} · {theme.sliderCount}本
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-slate-900">
              {theme.question}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
