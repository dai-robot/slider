import { formatNumber, formatPercent } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

export function calculateMonthlyPayment(
  principalMan: number,
  annualRate: number,
  years: number,
): number {
  const principal = principalMan * 10000;
  const months = years * 12;
  if (months <= 0) return 0;
  if (annualRate === 0) return principal / months;

  const monthlyRate = annualRate / 100 / 12;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}

function compute(state: SliderValues): ThemeOutput {
  const rate = state.rate;
  const years = state.years;
  const amount = state.amount;
  const monthly = calculateMonthlyPayment(amount, rate, years);
  const plusOne = calculateMonthlyPayment(amount, rate + 1, years);
  const delta = plusOne - monthly;
  const total = monthly * years * 12;
  const interest = total - amount * 10000;

  let status: ThemeOutput["status"];
  if (rate >= 3) {
    status = {
      kicker: "住まいの状態",
      label: "金利が重い",
      description:
        "同じ家でも、金利が高いと毎月の支払いが家計を圧迫します。期間が長いほど、その差は積み上がります。",
      tone: "negative",
    };
  } else if (rate <= 1) {
    status = {
      kicker: "住まいの状態",
      label: "低い金利",
      description:
        "今の金利なら、同じ借入でも毎月は比較的楽です。ただし期間を伸ばすと、利息の総額は静かに増えます。",
      tone: "positive",
    };
  } else {
    status = {
      kicker: "住まいの状態",
      label: "金利と期間の掛け算",
      description:
        "月々は金利、総額は期間の影響が大きいです。片方を動かすと、もう一方の意味も変わります。",
      tone: "accent",
    };
  }

  return {
    cards: [
      {
        label: "毎月の返済",
        value: `${formatNumber(Math.round(monthly))}円`,
        hint: `${formatNumber(amount)}万円 / ${years}年 / ${formatPercent(rate, 1)}`,
        graphic: { ratio: ratioInRange(monthly, 40000, 280000), mark: ratioInRange(110000, 40000, 280000) },
      },
      {
        label: "金利+1%すると",
        value: `+${formatNumber(Math.round(delta))}円`,
        hint: "同じ借入・同じ年数のとき",
        tone: "warning",
        graphic: { ratio: ratioInRange(delta, 0, 50000) },
      },
      {
        label: "総返済額",
        value: `${formatNumber(Math.round(total / 10000))}万`,
        hint: "元本と利息の合計",
        graphic: { ratio: ratioInRange(total / 10000, 2000, 12000), mark: ratioInRange(amount, 2000, 12000) },
      },
      {
        label: "利息の合計",
        value: `${formatNumber(Math.round(interest / 10000))}万`,
        hint: "家の値段に上乗せされるコスト",
        tone: "accent",
        graphic: { ratio: ratioInRange(interest / 10000, 0, 5000) },
      },
    ],
    status,
    explanation: [
      `毎月の返済は約${formatNumber(Math.round(monthly))}円です。`,
      `金利が1%上がるだけで、月々は約${formatNumber(Math.round(delta))}円増えます。`,
      `返済期間${years}年では、利息の合計は約${formatNumber(Math.round(interest / 10000))}万円。金利と年数は、別々ではなく掛け算で効きます。`,
    ].join(""),
    learningPoint:
      rate >= 2
        ? "住宅ローンは、家の値段だけでなく金利の値段でも買っている。"
        : "1%の金利差は、長い年月をかけると大きな金額になる。",
    chart: {
      title: "元本と利息",
      caption: "長いローンほど、利息の塊が見えてくる",
      bars: [
        { name: "借りた金額", value: amount, fill: "#0369a1" },
        {
          name: "利息の合計",
          value: Math.max(0, interest / 10000),
          fill: "#b45309",
        },
      ],
    },
  };
}

export const mortgageTheme: PlayableTheme = {
  id: "mortgage",
  number: "03",
  title: "住宅ローン",
  question: "金利が1%上がると、毎月どうなる？",
  teaser: "金利・年数・借入額。3つは独立ではなく、掛け算で家計を変える。",
  domain: "住まい",
  sliderCount: 3,
  interaction: "coupled",
  interactionNote: "金利は月々を、年数は総額を、借入は両方を動かす。",
  defaultValues: { rate: 1, years: 35, amount: 4000 },
  sliders: [
    {
      key: "rate",
      label: "金利",
      min: 0,
      max: 8,
      step: 0.1,
      unit: "%",
      description: "住宅ローンの年利。0.1%でも、長い返済では効いてくる",
      lowLabel: "安い",
      highLabel: "高い",
    },
    {
      key: "years",
      label: "返済年数",
      min: 10,
      max: 40,
      step: 1,
      unit: "年",
      description: "長くすると月々は楽になるが、利息の総額は増える",
      lowLabel: "短い",
      highLabel: "長い",
    },
    {
      key: "amount",
      label: "借入額",
      min: 2000,
      max: 8000,
      step: 100,
      unit: "万円",
      description: "借りる金額そのもの。家の値段に近い数字",
      lowLabel: "少ない",
      highLabel: "多い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "標準",
      description: "4000万 / 35年 / 1%",
      values: { rate: 1, years: 35, amount: 4000 },
    },
    {
      id: "low-rate",
      label: "超低金利",
      description: "0.5%のときの軽さ",
      values: { rate: 0.5, years: 35, amount: 4000 },
    },
    {
      id: "hike",
      label: "金利上昇",
      description: "同じ家、金利だけ3%",
      values: { rate: 3, years: 35, amount: 4000 },
    },
    {
      id: "shorter",
      label: "期間を縮める",
      description: "20年で返すと総額はどうなる",
      values: { rate: 1, years: 20, amount: 4000 },
    },
  ],
  resultHint: "元利均等返済の教育用モデルです。手数料や団信は含みません",
  compute,
};
