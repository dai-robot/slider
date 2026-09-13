import { SLIDER_CONFIGS } from "@/lib/constants";
import { ERA_MOMENTS, PRESENT_ERA_ID } from "@/lib/eras/moments";
import { clamp } from "@/lib/math";
import { getPlayableTheme } from "@/lib/themes/catalog";
import type { EraMoment, EraWorldId } from "@/types/era";
import type { SliderSpec, SliderValues } from "@/types/theme";

export { ERA_MOMENTS, PRESENT_ERA_ID };

export function getEra(id: string): EraMoment | undefined {
  return ERA_MOMENTS.find((era) => era.id === id);
}

export function getPresentEra(): EraMoment {
  const present = getEra(PRESENT_ERA_ID);
  if (!present) {
    throw new Error("Present era snapshot is missing");
  }
  return present;
}

export function getErasForTheme(themeId: string): EraMoment[] {
  return ERA_MOMENTS.filter((era) => era.worlds[themeId as EraWorldId]).sort(
    (a, b) => a.year - b.year,
  );
}

export function getEraValues(
  era: EraMoment,
  themeId: string,
): SliderValues | undefined {
  return era.worlds[themeId as EraWorldId];
}

export function getThemeSliders(themeId: string): SliderSpec[] {
  if (themeId === "stock") return SLIDER_CONFIGS;
  return getPlayableTheme(themeId)?.sliders ?? [];
}

export function clampToSliders(
  values: SliderValues,
  sliders: SliderSpec[],
): SliderValues {
  const next: SliderValues = { ...values };
  for (const slider of sliders) {
    if (next[slider.key] === undefined) continue;
    next[slider.key] = clamp(next[slider.key], slider.min, slider.max);
  }
  return next;
}

export function worldIdsForEra(era: EraMoment): EraWorldId[] {
  return Object.keys(era.worlds) as EraWorldId[];
}

export function featuredEras(): EraMoment[] {
  const ids = ["plaza-1985", "bubble-1989", "covid-2020", "inflation-2022"];
  return ids
    .map((id) => getEra(id))
    .filter((era): era is EraMoment => Boolean(era));
}

export function eraPresetId(eraId: string): string {
  return `era-${eraId}`;
}

export function isEraPresetId(presetId: string | null): boolean {
  return Boolean(presetId?.startsWith("era-"));
}

export function eraIdFromPreset(presetId: string | null): string | null {
  if (!presetId?.startsWith("era-")) return null;
  return presetId.slice(4);
}
