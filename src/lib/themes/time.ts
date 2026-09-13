import { formatNumber, formatPercent } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

const DEFAULT_PRINCIPAL = 100;

export function calculateFutureValue(
  principal: number,
  rate: number,
  years: number,
): number {
  return principal * (1 + rate / 100) ** years;
}

function yenLabel(man: number): string {
  return `${formatNumber(man, 0)}万円`;
}

function compute(state: SliderValues): ThemeOutput {
  const years = state.years;
  const rate = state.rate;
  const principal = state.principal ?? DEFAULT_PRINCIPAL;
  const future = calculateFutureValue(principal, rate, years);
  const later = calculateFutureValue(principal, rate, years + 10);
  const zeroRate = principal;
  const gain = future - principal;
  const startLabel = yenLabel(principal);

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
      description: `年数を伸ばすか、利率を上げると、同じ${startLabel}の未来が急に分かれます。金額を変えると、増え方の感じも変わります。`,
      tone: "accent",
    };
  }

  return {
    cards: [
      {
        label: `${years}年後`,
        value: `${formatNumber(future, 1)}万`,
        hint: `${startLabel}を年${formatPercent(rate, 1)}で置いたとき`,
        graphic: {
          ratio: ratioInRange(future, principal, principal * 8),
          mark: ratioInRange(principal, principal, principal * 8),
        },
      },
      {
        label: "増えた分",
        value: `${formatNumber(gain, 1)}万`,
        hint: "元本を超えて増えた金額",
        tone: gain > principal * 0.5 ? "positive" : "default",
        graphic: { ratio: ratioInRange(gain, 0, principal * 7) },
      },
      {
        label: "あと10年",
        value: `${formatNumber(later, 1)}万`,
        hint: "同じ利率で、さらに10年",
        tone: "accent",
        graphic: {
          ratio: ratioInRange(later, principal, principal * 12),
          mark: ratioInRange(future, principal, principal * 12),
        },
      },
      {
        label: "利率0%なら",
        value: `${formatNumber(zeroRate, 0)}万`,
        hint: "時間だけでは増えない",
        tone: "warning",
        graphic: {
          ratio: ratioInRange(zeroRate, 0, principal * 8),
          mark: ratioInRange(principal, 0, principal * 8),
        },
      },
    ],
    status,
    explanation: [
      `${startLabel}を年${formatPercent(rate, 1)}で${years}年置くと、約${formatNumber(future, 1)}万円になります。`,
      `同じ条件であと10年伸ばすと約${formatNumber(later, 1)}万円。後半の増え方が、前半より大きくなりやすいのが複利です。`,
      principal >= 1000
        ? "元本が大きいと、同じ利率でも増える額の実感がまったく違います。"
        : rate < 2
          ? "利率のスライダーを上げると、時間の意味が変わります。"
          : "年数だけ動かしても、利率だけ動かしても、未来の形は別物になります。",
    ].join(""),
    learningPoint:
      years >= 20
        ? "複利は、足し算ではなく、時間をかけた掛け算。"
        : "短い期間では、複利の差は小さく見える。",
    chart: {
      title: "元本と、時間の上乗せ",
      caption: `最初の${startLabel}と、複利が足した分`,
      bars: [
        { name: `最初の${formatNumber(principal, 0)}万`, value: principal, fill: "#0369a1" },
        { name: "増えた分", value: Math.max(0, gain), fill: "#0f766e" },
      ],
    },
  };
}

export const timeTheme: PlayableTheme = {
  id: "time",
  number: "05",
  title: "時間と複利",
  question: "同じお金が、何年後にいくらになる？",
  teaser: "100万円と1000万円では、同じ利率でも感じ方が違う。年数を足すと、さらに分かれる。",
  domain: "時間",
  sliderCount: 3,
  interaction: "coupled",
  interactionNote: "金額が前提。年数と利率が、そのお金の未来を変える。",
  defaultValues: { principal: DEFAULT_PRINCIPAL, years: 20, rate: 5 },
  sliders: [
    {
      key: "principal",
      label: "前提の金額",
      min: 100,
      max: 2000,
      step: 100,
      unit: "万円",
      description: "いま手元にあるお金。100万円と1000万円では、増えた分の実感が違う",
      lowLabel: "少ない",
      highLabel: "多い",
    },
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
      label: "100万円",
      description: "よくある長期の目安",
      values: { principal: 100, years: 20, rate: 5 },
    },
    {
      id: "ten-million",
      label: "1000万円",
      description: "同じ20年・5%でも、増え方が大きく感じる",
      values: { principal: 1000, years: 20, rate: 5 },
    },
    {
      id: "short",
      label: "5年",
      description: "まだ複利は地味",
      values: { principal: 100, years: 5, rate: 5 },
    },
    {
      id: "long",
      label: "40年",
      description: "時間を最大限使う",
      values: { principal: 100, years: 40, rate: 5 },
    },
    {
      id: "zero",
      label: "利率ゼロ",
      description: "時間だけがある世界",
      values: { principal: 100, years: 20, rate: 0 },
    },
  ],
  resultHint: "税金や手数料を除いた、単一利率の教育用モデルです",
  compute,
};
