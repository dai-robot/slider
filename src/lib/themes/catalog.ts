import { commuteTheme } from "@/lib/themes/commute";
import { energyTheme } from "@/lib/themes/energy";
import { fxTheme } from "@/lib/themes/fx";
import { mortgageTheme } from "@/lib/themes/mortgage";
import { stockThemeMeta } from "@/lib/themes/stock";
import { timeTheme } from "@/lib/themes/time";
import { wageTheme } from "@/lib/themes/wage";
import type { PlayableTheme, ThemeMeta } from "@/types/theme";

export const PLAYABLE_THEMES: PlayableTheme[] = [
  wageTheme,
  mortgageTheme,
  fxTheme,
  timeTheme,
  commuteTheme,
  energyTheme,
];

export const THEME_METAS: ThemeMeta[] = [stockThemeMeta, ...PLAYABLE_THEMES];

export function getThemeMeta(id: string): ThemeMeta | undefined {
  return THEME_METAS.find((theme) => theme.id === id);
}

export function getPlayableTheme(id: string): PlayableTheme | undefined {
  return PLAYABLE_THEMES.find((theme) => theme.id === id);
}

export function getRelatedThemes(id: string, limit = 3): ThemeMeta[] {
  const current = getThemeMeta(id);
  const others = THEME_METAS.filter((theme) => theme.id !== id);
  if (!current) return others.slice(0, limit);

  const opposite = others.filter(
    (theme) => theme.interaction !== current.interaction,
  );
  const same = others.filter(
    (theme) => theme.interaction === current.interaction,
  );
  return [...opposite, ...same].slice(0, limit);
}
