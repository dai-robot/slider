import { describe, expect, it } from "vitest";
import {
  ERA_MOMENTS,
  PRESENT_ERA_ID,
  clampToSliders,
  featuredEras,
  getEra,
  getEraValues,
  getErasForTheme,
  getPresentEra,
  getThemeSliders,
} from "@/lib/eras";
import { labeledCompareRows } from "@/lib/eras/metrics";
import { THEME_METAS } from "@/lib/themes/catalog";

const WORLD_IDS = THEME_METAS.map((theme) => theme.id);

describe("era catalog", () => {
  it("covers every world with several eras and a present snapshot", () => {
    const present = getPresentEra();
    expect(present.id).toBe(PRESENT_ERA_ID);

    for (const worldId of WORLD_IDS) {
      const eras = getErasForTheme(worldId);
      expect(eras.length).toBeGreaterThanOrEqual(4);
      expect(getEraValues(present, worldId)).toBeDefined();
      const years = eras.map((era) => era.year);
      expect(years).toEqual([...years].sort((a, b) => a - b));
    }
  });

  it("keeps famous extremes inside slider ranges", () => {
    const inflation1974 = getEraValues(getEra("inflation-1974")!, "wage")!;
    const plaza = getEraValues(getEra("plaza-1985")!, "fx")!;
    const yen1995 = getEraValues(getEra("yen-1995")!, "fx")!;
    const bubble = getEraValues(getEra("bubble-1989")!, "stock")!;

    const wageClamped = clampToSliders(inflation1974, getThemeSliders("wage"));
    const plazaClamped = clampToSliders(plaza, getThemeSliders("fx"));
    const yenClamped = clampToSliders(yen1995, getThemeSliders("fx"));
    const bubbleClamped = clampToSliders(bubble, getThemeSliders("stock"));

    expect(wageClamped.inflation).toBe(23);
    expect(plazaClamped.usdJpy).toBe(238);
    expect(yenClamped.usdJpy).toBe(80);
    expect(bubbleClamped.peRatio).toBe(40);
  });

  it("shows a gap between 1985 yen and now", () => {
    const then = getEraValues(getEra("plaza-1985")!, "fx")!;
    const now = getEraValues(getPresentEra(), "fx")!;
    const rows = labeledCompareRows("fx", then, now);
    expect(then.usdJpy).toBeGreaterThan(now.usdJpy);
    expect(rows[0]?.label).toBe("ドル円");
    expect(rows[0]?.delta).toContain("円");
  });

  it("lists featured eras for the home", () => {
    expect(featuredEras()).toHaveLength(4);
    expect(ERA_MOMENTS.length).toBeGreaterThanOrEqual(10);
  });
});
