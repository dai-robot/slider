export type SliderValues = Record<string, number>;

export type SliderSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
  lowLabel: string;
  highLabel: string;
};

export type ThemePreset = {
  id: string;
  label: string;
  description: string;
  values: SliderValues;
  source?: string;
};

export type ResultTone =
  | "default"
  | "positive"
  | "warning"
  | "negative"
  | "accent";

export type ResultGraphic = {
  ratio: number;
  mark?: number;
  origin?: "start" | "center";
};

export type ResultCardData = {
  label: string;
  value: string;
  hint?: string;
  tone?: ResultTone;
  graphic?: ResultGraphic;
};

export type ChartBar = {
  name: string;
  value: number;
  fill: string;
};

export type ThemeChart = {
  title: string;
  caption: string;
  bars: ChartBar[];
};

export type ThemeStatus = {
  kicker: string;
  label: string;
  description: string;
  tone: ResultTone;
};

export type ThemeOutput = {
  cards: ResultCardData[];
  status: ThemeStatus;
  explanation: string;
  learningPoint: string;
  chart: ThemeChart | null;
};

export type ThemeInteraction = "single" | "coupled";

export type ThemeMeta = {
  id: string;
  number: string;
  title: string;
  question: string;
  teaser: string;
  domain: string;
  sliderCount: number;
  interaction: ThemeInteraction;
  interactionNote: string;
};

export type PlayableTheme = ThemeMeta & {
  defaultValues: SliderValues;
  sliders: SliderSpec[];
  presets: ThemePreset[];
  resultHint: string;
  compute: (state: SliderValues) => ThemeOutput;
};
