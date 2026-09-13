import { formatNumber, formatPercent, formatSigned } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

const DEFAULT_INCOME = 400;

export function calculateRealIncomeChange(
  wageGrowth: number,
  inflation: number,
): number {
  return ((100 + wageGrowth) / (100 + inflation) - 1) * 100;
}

function compute(state: SliderValues): ThemeOutput {
  const wageGrowth = state.wageGrowth;
  const inflation = state.inflation;
  const income = state.income ?? DEFAULT_INCOME;
  const nominal = (income * (100 + wageGrowth)) / 100;
  const real = (nominal * 100) / (100 + inflation);
  const realChange = calculateRealIncomeChange(wageGrowth, inflation);
  const gap = wageGrowth - inflation;

  let status: ThemeOutput["status"];
  if (realChange >= 2) {
    status = {
      kicker: "暮らしの状態",
      label: "実質で少し豊か",
      description:
        "給料の伸びが物価を上回っています。手元に残る購買力は、去年より増えています。",
      tone: "positive",
    };
  } else if (realChange <= -2) {
    status = {
      kicker: "暮らしの状態",
      label: "名目だけ増えた",
      description:
        "給料は増えても、物価の上昇のほうが大きいです。同じ生活を続けるのは、去年より難しくなります。",
      tone: "negative",
    };
  } else {
    status = {
      kicker: "暮らしの状態",
      label: "ほぼ相殺",
      description:
        "給料と物価が同じ方向に動いて、購買力はあまり変わっていません。増えた感覚と、残る力は別物です。",
      tone: "warning",
    };
  }

  const parts = [
    `名目の年収は約${formatNumber(nominal, 1)}万円（${formatSigned(wageGrowth, 1)}%）です。`,
    inflation >= 4
      ? `インフレ${formatPercent(inflation, 1)}の下では、実質は約${formatNumber(real, 1)}万円まで目減りします。`
      : `物価が${formatPercent(inflation, 1)}動くと、実質年収は約${formatNumber(real, 1)}万円です。`,
    gap < 0
      ? "給料が上がっても、買い物カゴが先に軽くなることがあります。"
      : "給料と物価を同時に見ると、本当に豊かになれたかが分かります。",
  ];

  return {
    cards: [
      {
        label: "名目年収",
        value: `${formatNumber(nominal, 1)}万`,
        hint: `基準${formatNumber(income, 0)}万円 × (1 + 賃上げ)`,
        graphic: {
          ratio: ratioInRange(nominal, income * 0.7, income * 1.4),
          mark: ratioInRange(income, income * 0.7, income * 1.4),
        },
      },
      {
        label: "実質年収",
        value: `${formatNumber(real, 1)}万`,
        hint: "名目 ÷ (1 + インフレ率)",
        tone: realChange < 0 ? "warning" : "positive",
        graphic: {
          ratio: ratioInRange(real, income * 0.6, income * 1.4),
          mark: ratioInRange(income, income * 0.6, income * 1.4),
        },
      },
      {
        label: "実質の変化",
        value: formatPercent(realChange, 1),
        hint: "賃上げと物価の差し引き",
        tone: realChange >= 1 ? "positive" : realChange < 0 ? "negative" : "default",
        graphic: { ratio: ratioInRange(realChange, -15, 15), mark: 0.5, origin: "center" },
      },
      {
        label: "賃上げ − 物価",
        value: `${formatSigned(gap, 1)}pt`,
        hint: "プラスなら購買力は増えやすい",
        tone: "accent",
        graphic: { ratio: ratioInRange(gap, -20, 20), mark: 0.5, origin: "center" },
      },
    ],
    status,
    explanation: parts.join(""),
    learningPoint:
      inflation > wageGrowth
        ? "給料が上がっても、豊かになったとは限らない。"
        : "豊かさは、名目の数字ではなく実質の購買力で測る。",
    chart: {
      title: "名目と実質",
      caption: "同じ給料でも、物価が上がると手元の力は小さくなる",
      bars: [
        { name: "名目年収", value: nominal, fill: "#0369a1" },
        { name: "実質年収", value: real, fill: "#0f766e" },
      ],
    },
  };
}

export const wageTheme: PlayableTheme = {
  id: "wage",
  number: "02",
  title: "給料と物価",
  question: "給料が上がっても、豊かにならない？",
  teaser: "出発点の年収を変えると、同じ％でも手元の金額の感じが違う。",
  domain: "暮らし",
  sliderCount: 3,
  interaction: "coupled",
  interactionNote: "年収が前提。賃上げと物価は互いに打ち消し合う。",
  defaultValues: { income: DEFAULT_INCOME, wageGrowth: 3, inflation: 2 },
  sliders: [
    {
      key: "income",
      label: "今の年収",
      min: 100,
      max: 2000,
      step: 50,
      unit: "万円",
      description: "出発点の金額。100万円と1000万円では、同じ％でも残る実感が違う",
      lowLabel: "少ない",
      highLabel: "多い",
    },
    {
      key: "wageGrowth",
      label: "賃上げ率",
      min: -5,
      max: 30,
      step: 0.1,
      unit: "%",
      description: "今年、給料がどれくらい増えるか（減るか）",
      lowLabel: "下がる",
      highLabel: "上がる",
    },
    {
      key: "inflation",
      label: "インフレ率",
      min: -2,
      max: 25,
      step: 0.1,
      unit: "%",
      description: "買うものの値段が、毎年どれくらい上がるか",
      lowLabel: "低い",
      highLabel: "高い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "ふつうの年",
      description: "少し上がって、少し物価も上がる",
      values: { income: 400, wageGrowth: 3, inflation: 2 },
    },
    {
      id: "stagnation",
      label: "名目だけの春",
      description: "給料3%、物価6%",
      values: { income: 400, wageGrowth: 3, inflation: 6 },
    },
    {
      id: "real-gain",
      label: "実質で得する",
      description: "給料が物価を追い越す",
      values: { income: 400, wageGrowth: 5, inflation: 1 },
    },
    {
      id: "shock",
      label: "物価ショック",
      description: "給料は止まり、店の値段だけ走る",
      values: { income: 400, wageGrowth: 0.5, inflation: 8 },
    },
    {
      id: "ten-million",
      label: "1000万円",
      description: "同じ％でも、金額の感じは別物",
      values: { income: 1000, wageGrowth: 3, inflation: 2 },
    },
  ],
  resultHint: "出発点の年収から、1年後の名目と実質を比べます",
  compute,
};
