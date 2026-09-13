import type { ThemeMeta } from "@/types/theme";

export const stockThemeMeta: ThemeMeta = {
  id: "stock",
  number: "01",
  title: "日経平均",
  question: "日経平均はなぜ上がるのか？",
  teaser: "利益・金利・PER・インフレ。4つが同時に動くと、日経平均の意味が変わる。",
  domain: "お金",
  sliderCount: 4,
  interaction: "coupled",
  interactionNote: "利益でEPSが、金利で参考PERが、インフレで実質価値が変わる。",
};
