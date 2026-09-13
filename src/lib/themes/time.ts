import { formatNumber, formatPercent } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

const PRINCIPAL = 100;

export function calculateFutureValue(
  principal: number,
  rate: number,
  years: number,
): number {
  return principal * (1 + rate / 100) ** years;
}

function compute(state: SliderValues): ThemeOutput {
  const years = state.years;
  const rate = state.rate;
  const future = calculateFutureValue(PRINCIPAL, rate, years);
  const later = calculateFutureValue(PRINCIPAL, rate, years + 10);
  const zeroRate = PRINCIPAL;
  const gain = future - PRINCIPAL;

  let status: ThemeOutput["status"];
  if (years >= 25 && rate >= 5) {
    status = {
      kicker: "時間の状態",
      label: "複利が形になる",
      description:
        "長い時間と、少しの利回りが重なると、増える量そのものが加速します。最初の数年では見えにくい変化です。",
      tone: "positive",
    };
  } else if (rate <= 1) {
    status = {
      kicker: "時間の状態",
      label: "時間だけが過ぎる",
      description:
        "利回りがほとんどないと、何年置いても数字はあまり増えません。時間は、利率があって初めて味方になります。",
      tone: "warning",
    };
  } else {
    status = {
      kicker: "時間の状態",
      label: "まだ静かな複利",
      description:
        "年数を伸ばすか、利率を上げると、同じ100万円の未来が急に分かれます。1本でも、2本でも、変化は見えます。",
      tone: "accent",
    };
  }

  return {
    cards: [
      {
        label: `${years}年後`,
        value: `${formatNumber(future, 1)}万`,
        hint: `100万円を年${formatPercent(rate, 1)}で置いたとき`,
        graphic: { ratio: ratioInRange(future, 100, 800), mark: ratioInRange(100, 100, 800) },
      },
      {
        label: "増えた分",
        value: `${formatNumber(gain, 1)}万`,
        hint: "元本を超えて増えた金額",
        tone: gain > 50 ? "positive" : "default",
        graphic: { ratio: ratioInRange(gain, 0, 700) },
      },
      {
        label: "あと10年",
        value: `${formatNumber(later, 1)}万`,
        hint: "同じ利率で、さらに10年",
        tone: "accent",
        graphic: { ratio: ratioInRange(later, 100, 1200), mark: ratioInRange(future, 100, 1200) },
      },
      {
        label: "利率0%なら",
        value: `${formatNumber(zeroRate, 0)}万`,
        hint: "時間だけでは増えない",
        tone: "warning",
        graphic: { ratio: ratioInRange(zeroRate, 0, 800), mark: ratioInRange(100, 0, 800) },
      },
    ],
    status,
    explanation: [
      `100万円を年${formatPercent(rate, 1)}で${years}年置くと、約${formatNumber(future, 1)}万円になります。`,
      `同じ条件であと10年伸ばすと約${formatNumber(later, 1)}万円。後半の増え方が、前半より大きくなりやすいのが複利です。`,
      rate < 2
        ? "利率のスライダーを上げると、時間の意味が変わります。"
        : "年数だけ動かしても、利率だけ動かしても、未来の形は別物になります。",
    ].join(""),
    learningPoint:
      years >= 20
        ? "複利は、足し算ではなく、時間をかけた掛け算。"
        : "短い期間では、複利の差は小さく見える。",
    chart: {
      title: "元本と、時間の上乗せ",
      caption: "最初の100万円と、複利が足した分",
      bars: [
        { name: "最初の100万", value: PRINCIPAL, fill: "#0369a1" },
        { name: "増えた分", value: Math.max(0, gain), fill: "#0f766e" },
      ],
    },
  };
}

export const timeTheme: PlayableTheme = {
  id: "time",
  number: "05",
  title: "時間と複利",
  question: "同じ100万円が、何年後にいくらになる？",
  teaser: "年数だけでも見える。利率を足すと、時間の意味が変わる。",
  domain: "時間",
  sliderCount: 2,
  interaction: "coupled",
  interactionNote: "1本（年数）でも形は見える。利率を足すと、時間の価値が変わる。",
  defaultValues: { years: 20, rate: 5 },
  sliders: [
    {
      key: "years",
      label: "年数",
      min: 1,
      max: 40,
      step: 1,
      unit: "年",
      description: "お金を置いておく時間。複利は、長く置くほど加速する",
      lowLabel: "短い",
      highLabel: "長い",
    },
    {
      key: "rate",
      label: "年利",
      min: 0,
      max: 12,
      step: 0.1,
      unit: "%",
      description: "1年でどれくらい増えるか。ゼロなら、時間は増やす力を持たない",
      lowLabel: "低い",
      highLabel: "高い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "20年・5%",
      description: "よくある長期の目安",
      values: { years: 20, rate: 5 },
    },
    {
      id: "short",
      label: "5年",
      description: "まだ複利は地味",
      values: { years: 5, rate: 5 },
    },
    {
      id: "long",
      label: "40年",
      description: "時間を最大限使う",
      values: { years: 40, rate: 5 },
    },
    {
      id: "zero",
      label: "利率ゼロ",
      description: "時間だけがある世界",
      values: { years: 20, rate: 0 },
    },
  ],
  resultHint: "税金や手数料を除いた、単一利率の教育用モデルです",
  compute,
};
