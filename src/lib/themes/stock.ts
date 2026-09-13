import type { ThemeMeta } from "@/types/theme";

export const stockThemeMeta: ThemeMeta = {
  id: "stock",
  number: "01",
  title: "株価",
  question: "株価はなぜ上がるのか？",
  teaser: "利益・金利・PER・インフレ。4つが同時に動くと、株価の意味が変わる。",
  domain: "お金",
  sliderCount: 4,
  interaction: "coupled",
  interactionNote: "利益でEPSが、金利で参考PERが、インフレで実質価値が変わる。",
};
