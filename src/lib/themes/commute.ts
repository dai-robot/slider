import { formatNumber } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

const WORKDAYS = 220;
const ASSUMED_HOURLY_YEN = 2000;

export function calculateCommuteHours(oneWayMinutes: number): number {
  return (oneWayMinutes * 2 * WORKDAYS) / 60;
}

function compute(state: SliderValues): ThemeOutput {
  const minutes = state.minutes;
  const hours = calculateCommuteHours(minutes);
  const workdays = hours / 8;
  const tenYears = hours * 10;
  const money = hours * ASSUMED_HOURLY_YEN;

  let status: ThemeOutput["status"];
  if (minutes >= 70) {
    status = {
      kicker: "時間の状態",
      label: "通勤がもう一つの仕事",
      description:
        "片道だけで、1年の労働日が何日も消えます。家賃との交換条件として、この数字を見る必要があります。",
      tone: "warning",
    };
  } else if (minutes <= 20) {
    status = {
      kicker: "時間の状態",
      label: "近い場所の価値",
      description:
        "短い通勤は、給料明細に出ない昇給です。毎日小さいので、年間にしないと見えません。",
      tone: "positive",
    };
  } else {
    status = {
      kicker: "時間の状態",
      label: "毎日が積み上がる",
      description:
        "1日の往復は小さく見えて、220日かけると大きな塊になります。スライダー1本で、その塊が見えます。",
      tone: "accent",
    };
  }

  return {
    cards: [
      {
        label: "1年の通勤",
        value: `${formatNumber(hours, 0)}時間`,
        hint: `片道${formatNumber(minutes, 0)}分 × 往復 × ${WORKDAYS}日`,
        graphic: { ratio: ratioInRange(hours, 0, 880), mark: ratioInRange(330, 0, 880) },
      },
      {
        label: "労働日に換算",
        value: `${formatNumber(workdays, 1)}日`,
        hint: "8時間労働として",
        tone: workdays >= 20 ? "warning" : "default",
        graphic: { ratio: ratioInRange(workdays, 0, 110), mark: ratioInRange(20, 0, 110) },
      },
      {
        label: "10年で",
        value: `${formatNumber(tenYears, 0)}時間`,
        hint: "同じ通勤を続けたとき",
        tone: "accent",
        graphic: { ratio: ratioInRange(tenYears, 0, 8800) },
      },
      {
        label: "時間の値段",
        value: `${formatNumber(Math.round(money / 10000))}万`,
        hint: `仮に時給${formatNumber(ASSUMED_HOURLY_YEN)}円とした場合`,
        graphic: { ratio: ratioInRange(money / 10000, 0, 180) },
      },
    ],
    status,
    explanation: [
      `片道${formatNumber(minutes, 0)}分の通勤は、1年で約${formatNumber(hours, 0)}時間です。`,
      `8時間労働に直すと約${formatNumber(workdays, 1)}日。10年続けると約${formatNumber(tenYears, 0)}時間になります。`,
      "スライダーは1本です。変数を増やさなくても、日常の見え方は変わります。",
    ].join(""),
    learningPoint:
      minutes >= 60
        ? "遠い家の安さは、通勤時間という見えない家賃とセットで見る。"
        : "小さい毎日は、年にすると初めて大きく見える。",
    chart: {
      title: "1年の時間の使い方",
      caption: `年間の通勤時間と、8時間労働1日の大きさ`,
      bars: [
        { name: "通勤（年）", value: hours, fill: "#b45309" },
        { name: "労働1日", value: 8, fill: "#94a3b8" },
      ],
    },
  };
}

export const commuteTheme: PlayableTheme = {
  id: "commute",
  number: "06",
  title: "通勤時間",
  question: "片道15分増えると、1年で何時間消える？",
  teaser: "スライダーは1本でいい。毎日の小ささが、年になると塊になる。",
  domain: "暮らし",
  sliderCount: 1,
  interaction: "single",
  interactionNote: "変数は1つ。往復と日数が、自動で時間の塊に変わる。",
  defaultValues: { minutes: 45 },
  sliders: [
    {
      key: "minutes",
      label: "片道の通勤",
      min: 5,
      max: 120,
      step: 5,
      unit: "分",
      description: "家から職場まで、片道何分かかるか",
      lowLabel: "近い",
      highLabel: "遠い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "45分",
      description: "よくある郊外",
      values: { minutes: 45 },
    },
    {
      id: "near",
      label: "15分",
      description: "歩ける距離",
      values: { minutes: 15 },
    },
    {
      id: "far",
      label: "90分",
      description: "乗り換えの多い朝",
      values: { minutes: 90 },
    },
    {
      id: "extreme",
      label: "120分",
      description: "片道2時間",
      values: { minutes: 120 },
    },
  ],
  resultHint: `週5・年${WORKDAYS}日勤務として換算。時給は教育用の仮定（${formatNumber(ASSUMED_HOURLY_YEN)}円）です`,
  compute,
};
