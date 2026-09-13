import {
  BASE_EPS,
  INITIAL_PE,
  INITIAL_PRICE,
  REFERENCE_PER_PARAMS,
} from "@/lib/constants";
import {
  calculateMarketStatus,
  generateExplanation,
  generateLearningPoint,
  getValuationLabel,
} from "@/lib/marketStatus";
import { clamp } from "@/lib/math";
import type { CalculatedResult, SimulationState } from "@/types/simulation";

export { clamp };

export function calculateEPS(
  earningsGrowth: number,
  baseEps: number = BASE_EPS,
): number {
  return (baseEps * (100 + earningsGrowth)) / 100;
}

export function calculateNominalStockPrice(
  eps: number,
  peRatio: number,
): number {
  return eps * peRatio;
}

export function calculateRealStockPrice(
  nominalStockPrice: number,
  inflationRate: number,
): number {
  return (nominalStockPrice * 100) / (100 + inflationRate);
}

/**
 * 教育用の簡易モデル:
 * 参考PER = clamp(25 - 金利 × 2, 8, 35)
 */
export function calculateReferencePER(interestRate: number): number {
  const { base, rateMultiplier, min, max } = REFERENCE_PER_PARAMS;
  return clamp(base - interestRate * rateMultiplier, min, max);
}

export function calculateValuationGap(
  peRatio: number,
  referencePER: number,
): number {
  return peRatio - referencePER;
}

export {
  calculateMarketStatus,
  generateExplanation,
  generateLearningPoint,
  getValuationLabel,
};

export function calculateSimulation(
  state: SimulationState,
): CalculatedResult {
  const eps = calculateEPS(state.earningsGrowth);
  const nominalStockPrice = calculateNominalStockPrice(eps, state.peRatio);
  const realStockPrice = calculateRealStockPrice(
    nominalStockPrice,
    state.inflationRate,
  );
  const referencePER = calculateReferencePER(state.interestRate);
  const valuationGap = calculateValuationGap(state.peRatio, referencePER);
  const valuationLabel = getValuationLabel(valuationGap);
  const status = calculateMarketStatus(state, referencePER);

  // 基準株価からの分解: 利益効果 + PER効果 = 名目変化
  const earningsEffect =
    BASE_EPS * (state.earningsGrowth / 100) * INITIAL_PE;
  const peEffect = eps * (state.peRatio - INITIAL_PE);
  const inflationDrag = nominalStockPrice - realStockPrice;

  return {
    eps,
    nominalStockPrice,
    realStockPrice,
    referencePER,
    valuationGap,
    valuationLabel,
    marketStatus: status.label,
    marketStatusId: status.id,
    marketStatusDescription: status.description,
    explanation: generateExplanation(
      state,
      referencePER,
      nominalStockPrice,
      realStockPrice,
    ),
    learningPoint: generateLearningPoint(state, referencePER),
    decomposition: {
      basePrice: INITIAL_PRICE,
      earningsEffect,
      peEffect,
      inflationDrag,
    },
  };
}
