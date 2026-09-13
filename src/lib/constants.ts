import type { SimulationState, SliderConfig } from "@/types/simulation";

/** 基準企業のEPS（円） */
export const BASE_EPS = 100;

/** 基準PER（倍） */
export const INITIAL_PE = 20;

/** 基準株価 = BASE_EPS × INITIAL_PE */
export const INITIAL_PRICE = BASE_EPS * INITIAL_PE;

/** バリュエーション差の判定閾値（教育用パラメータ） */
export const VALUATION_THRESHOLDS = {
  veryExpensive: 8,
  somewhatExpensive: 3,
  somewhatCheap: -3,
  veryCheap: -8,
} as const;

/** 参考PER算出の教育用パラメータ */
export const REFERENCE_PER_PARAMS = {
  base: 25,
  rateMultiplier: 2,
  min: 8,
  max: 35,
} as const;

export const DEFAULT_STATE: SimulationState = {
  inflationRate: 2,
  interestRate: 3,
  earningsGrowth: 6,
  peRatio: 20,
};

export const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: "inflationRate",
    label: "インフレ率",
    min: -2,
    max: 15,
    step: 0.1,
    unit: "%",
    description: "モノやサービスの価格が毎年どれくらい上がるか",
    lowLabel: "低い",
    highLabel: "高い",
  },
  {
    key: "interestRate",
    label: "金利",
    min: 0,
    max: 10,
    step: 0.1,
    unit: "%",
    description: "お金を借りるコスト。株式の評価にも影響する",
    lowLabel: "低い",
    highLabel: "高い",
  },
  {
    key: "earningsGrowth",
    label: "利益成長率",
    min: -20,
    max: 30,
    step: 1,
    unit: "%",
    description: "企業の利益が1年間でどれくらい増減するか",
    lowLabel: "減少",
    highLabel: "増加",
  },
  {
    key: "peRatio",
    label: "PER",
    min: 8,
    max: 40,
    step: 1,
    unit: "倍",
    description: "投資家が企業利益の何倍まで株価を払うか",
    lowLabel: "割安",
    highLabel: "割高",
  },
];
