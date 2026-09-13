export type SimulationState = {
  inflationRate: number;
  interestRate: number;
  earningsGrowth: number;
  peRatio: number;
};

export type MarketStatusId =
  | "growth"
  | "overheated"
  | "recession"
  | "rate_headwind"
  | "neutral"
  | "slightly_overheated"
  | "undervalued";

export type ValuationLabel =
  | "かなり割高"
  | "やや割高"
  | "おおむね中立"
  | "やや割安"
  | "かなり割安";

export type PriceDecomposition = {
  basePrice: number;
  earningsEffect: number;
  peEffect: number;
  inflationDrag: number;
};

export type CalculatedResult = {
  eps: number;
  nominalStockPrice: number;
  realStockPrice: number;
  referencePER: number;
  valuationGap: number;
  valuationLabel: ValuationLabel;
  marketStatus: string;
  marketStatusId: MarketStatusId;
  marketStatusDescription: string;
  explanation: string;
  learningPoint: string;
  decomposition: PriceDecomposition;
};

export type SliderConfig = {
  key: keyof SimulationState | string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
  lowLabel: string;
  highLabel: string;
};

export type Preset = {
  id: string;
  label: string;
  description: string;
  values: SimulationState;
};
