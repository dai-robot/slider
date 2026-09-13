import { DEFAULT_STATE } from "@/lib/constants";
import type { Preset, SimulationState } from "@/types/simulation";

export const PRESETS: Preset[] = [
  {
    id: "low-rate-growth",
    label: "低金利・成長",
    description: "安いお金 × 強い利益成長",
    values: {
      inflationRate: 1,
      interestRate: 1,
      earningsGrowth: 10,
      peRatio: 25,
    },
  },
  {
    id: "inflation",
    label: "インフレ相場",
    description: "物価上昇が目立つ局面",
    values: {
      inflationRate: 7,
      interestRate: 4,
      earningsGrowth: 8,
      peRatio: 20,
    },
  },
  {
    id: "rate-shock",
    label: "金利ショック",
    description: "急な引き締めで評価が縮む",
    values: {
      inflationRate: 5,
      interestRate: 7,
      earningsGrowth: 3,
      peRatio: 14,
    },
  },
  {
    id: "bubble",
    label: "バブル",
    description: "期待が利益を追い越す",
    values: {
      inflationRate: 3,
      interestRate: 4,
      earningsGrowth: 5,
      peRatio: 35,
    },
  },
];

export const RESET_PRESET: Preset = {
  id: "default",
  label: "初期値",
  description: "はじめてのバランス",
  values: { ...DEFAULT_STATE },
};

export function isSameState(a: SimulationState, b: SimulationState): boolean {
  return (
    a.inflationRate === b.inflationRate &&
    a.interestRate === b.interestRate &&
    a.earningsGrowth === b.earningsGrowth &&
    a.peRatio === b.peRatio
  );
}
