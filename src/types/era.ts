import type { SliderValues } from "@/types/theme";

export type EraWorldId =
  | "stock"
  | "wage"
  | "mortgage"
  | "fx"
  | "time"
  | "commute"
  | "energy";

export type EraMoment = {
  id: string;
  year: number;
  title: string;
  summary: string;
  source: string;
  note: string;
  worlds: Partial<Record<EraWorldId, SliderValues>>;
};

export type EraCompareRow = {
  label: string;
  thenValue: string;
  nowValue: string;
  delta: string;
};
