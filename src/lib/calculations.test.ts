import { describe, expect, it } from "vitest";
import {
  calculateEPS,
  calculateNominalStockPrice,
  calculateRealStockPrice,
  calculateReferencePER,
  calculateSimulation,
  calculateValuationGap,
  clamp,
} from "@/lib/calculations";
import { calculateMarketStatus, getValuationLabel } from "@/lib/marketStatus";

describe("clamp", () => {
  it("clamps to min and max", () => {
    expect(clamp(5, 8, 35)).toBe(8);
    expect(clamp(40, 8, 35)).toBe(35);
    expect(clamp(20, 8, 35)).toBe(20);
  });
});

describe("calculateEPS", () => {
  it("grows EPS by earnings growth rate", () => {
    expect(calculateEPS(10)).toBe(110);
    expect(calculateEPS(0)).toBe(100);
    expect(calculateEPS(-10)).toBe(90);
  });
});

describe("calculateNominalStockPrice", () => {
  it("multiplies EPS by PER", () => {
    expect(calculateNominalStockPrice(110, 20)).toBe(2200);
    expect(calculateNominalStockPrice(100, 20)).toBe(2000);
  });
});

describe("calculateRealStockPrice", () => {
  it("adjusts nominal price by inflation", () => {
    expect(calculateRealStockPrice(2200, 10)).toBe(2000);
    expect(calculateRealStockPrice(2000, 0)).toBe(2000);
  });
});

describe("calculateReferencePER", () => {
  it("follows the educational formula and clamps", () => {
    expect(calculateReferencePER(1)).toBe(23);
    expect(calculateReferencePER(5)).toBe(15);
    expect(calculateReferencePER(8)).toBe(9);
    // 25 - 0*2 = 25
    expect(calculateReferencePER(0)).toBe(25);
    // 25 - 10*2 = 5 -> clamp to 8
    expect(calculateReferencePER(10)).toBe(8);
    // high enough to hit floor earlier
    expect(calculateReferencePER(9)).toBe(8);
  });
});

describe("calculateValuationGap", () => {
  it("subtracts reference PER from user PER", () => {
    expect(calculateValuationGap(25, 15)).toBe(10);
    expect(calculateValuationGap(15, 15)).toBe(0);
    expect(calculateValuationGap(10, 15)).toBe(-5);
  });
});

describe("getValuationLabel", () => {
  it("maps gaps to educational labels", () => {
    expect(getValuationLabel(8)).toBe("かなり割高");
    expect(getValuationLabel(5)).toBe("やや割高");
    expect(getValuationLabel(0)).toBe("おおむね中立");
    expect(getValuationLabel(-5)).toBe("やや割安");
    expect(getValuationLabel(-10)).toBe("かなり割安");
  });
});

describe("calculateMarketStatus", () => {
  it("detects recession when earnings decline", () => {
    const status = calculateMarketStatus(
      {
        inflationRate: 2,
        interestRate: 3,
        earningsGrowth: -5,
        peRatio: 18,
      },
      19,
    );
    expect(status.id).toBe("recession");
  });

  it("detects overheated when PER is far above reference", () => {
    const status = calculateMarketStatus(
      {
        inflationRate: 2,
        interestRate: 4,
        earningsGrowth: 5,
        peRatio: 35,
      },
      17,
    );
    expect(status.id).toBe("overheated");
  });

  it("detects growth market with strong earnings and low rates", () => {
    const status = calculateMarketStatus(
      {
        inflationRate: 1,
        interestRate: 1,
        earningsGrowth: 10,
        peRatio: 25,
      },
      23,
    );
    expect(status.id).toBe("growth");
  });

  it("detects rate headwind with high rates and soft growth", () => {
    const status = calculateMarketStatus(
      {
        inflationRate: 5,
        interestRate: 7,
        earningsGrowth: 3,
        peRatio: 14,
      },
      11,
    );
    expect(status.id).toBe("rate_headwind");
  });
});

describe("calculateSimulation", () => {
  it("integrates the full pipeline for a growth scenario", () => {
    const result = calculateSimulation({
      inflationRate: 10,
      interestRate: 5,
      earningsGrowth: 10,
      peRatio: 20,
    });

    expect(result.eps).toBe(110);
    expect(result.nominalStockPrice).toBe(2200);
    expect(result.realStockPrice).toBe(2000);
    expect(result.referencePER).toBe(15);
    expect(result.valuationGap).toBe(5);
    expect(result.explanation.length).toBeGreaterThan(20);
    expect(result.learningPoint.length).toBeGreaterThan(5);
  });
});
