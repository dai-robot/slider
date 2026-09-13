import { describe, expect, it } from "vitest";
import { snapToStep } from "@/lib/math";
import { THEME_METAS, getPlayableTheme, getThemeMeta } from "@/lib/themes/catalog";
import { calculateCommuteHours } from "@/lib/themes/commute";
import { calculateMonthlyBill, energyTheme } from "@/lib/themes/energy";
import { calculateYenGap, fxTheme } from "@/lib/themes/fx";
import { calculateMonthlyPayment } from "@/lib/themes/mortgage";
import { calculateFutureValue, timeTheme } from "@/lib/themes/time";
import { calculateRealIncomeChange, wageTheme } from "@/lib/themes/wage";

describe("theme catalog", () => {
  it("lists one single-slider world and several coupled worlds", () => {
    expect(THEME_METAS).toHaveLength(7);
    expect(THEME_METAS.filter((theme) => theme.interaction === "single")).toHaveLength(1);
    expect(getThemeMeta("stock")?.sliderCount).toBe(4);
    expect(getPlayableTheme("commute")?.sliderCount).toBe(1);
  });
});

describe("snapToStep", () => {
  it("respects decimal and large steps", () => {
    expect(snapToStep(2.04, 0.1)).toBe(2);
    expect(snapToStep(4050, 100)).toBe(4100);
  });
});

describe("wage", () => {
  it("shows real income falling when inflation outruns wages", () => {
    expect(calculateRealIncomeChange(3, 6)).toBeCloseTo(-2.83, 2);
    const richer = wageTheme.compute({ wageGrowth: 5, inflation: 1 });
    const poorer = wageTheme.compute({ wageGrowth: 3, inflation: 6 });
    expect(richer.status.tone).toBe("positive");
    expect(poorer.status.tone).toBe("negative");
  });
});

describe("mortgage", () => {
  it("uses straight division when the rate is zero", () => {
    expect(calculateMonthlyPayment(1200, 0, 10)).toBe(100000);
  });

  it("raises the monthly payment when the rate rises", () => {
    const low = calculateMonthlyPayment(4000, 1, 35);
    const high = calculateMonthlyPayment(4000, 2, 35);
    expect(high).toBeGreaterThan(low);
    expect(low).toBeGreaterThan(110000);
    expect(low).toBeLessThan(120000);
  });
});

describe("fx", () => {
  it("treats a weaker yen as a positive gap from 150", () => {
    expect(calculateYenGap(165)).toBe(10);
    expect(calculateYenGap(135)).toBe(-10);
    const weak = fxTheme.compute({ usdJpy: 165, oil: 80, importShare: 30 });
    const strong = fxTheme.compute({ usdJpy: 135, oil: 80, importShare: 30 });
    expect(weak.cards[0].tone).toBe("positive");
    expect(strong.cards[0].tone).toBe("negative");
  });
});

describe("time", () => {
  it("compounds 100 at 5% for 10 years", () => {
    expect(calculateFutureValue(100, 5, 10)).toBeCloseTo(162.889, 3);
    const zero = timeTheme.compute({ years: 20, rate: 0 });
    expect(zero.cards[0].value).toContain("100");
  });
});

describe("commute", () => {
  it("turns a one-way trip into yearly hours", () => {
    expect(calculateCommuteHours(45)).toBe(330);
    expect(calculateCommuteHours(60)).toBe(440);
  });
});

describe("energy", () => {
  it("multiplies price, usage, and saving", () => {
    expect(calculateMonthlyBill(30, 400, 0)).toBe(12000);
    expect(calculateMonthlyBill(30, 400, 10)).toBe(10800);
    const insulated = energyTheme.compute({ price: 31, kwh: 350, saving: 30 });
    expect(insulated.status.tone).toBe("positive");
  });
});
