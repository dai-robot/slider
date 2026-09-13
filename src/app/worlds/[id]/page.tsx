import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorldPlay } from "@/components/WorldPlay";
import { THEME_METAS, getPlayableTheme, getThemeMeta } from "@/lib/themes/catalog";

type WorldPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return THEME_METAS.map((theme) => ({ id: theme.id }));
}

export async function generateMetadata({
  params,
}: WorldPageProps): Promise<Metadata> {
  const { id } = await params;
  const theme = getThemeMeta(id);
  if (!theme) {
    return { title: "スライダー" };
  }
  return {
    title: `${theme.question} | スライダー`,
    description: theme.teaser,
  };
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { id } = await params;
  const theme = getThemeMeta(id);
  if (!theme) notFound();
  if (id !== "stock" && !getPlayableTheme(id)) notFound();

  return (
    <Suspense fallback={null}>
      <WorldPlay id={id} />
    </Suspense>
  );
}
