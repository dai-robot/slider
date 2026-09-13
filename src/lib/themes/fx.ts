import { formatNumber, formatSigned } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

const BASE_USDJPY = 150;
const BASE_OIL = 80;

export function calculateYenGap(usdJpy: number): number {
  return ((usdJpy - BASE_USDJPY) / BASE_USDJPY) * 100;
}

function compute(state: SliderValues): ThemeOutput {
  const usdJpy = state.usdJpy;
  const oil = state.oil;
  const importShare = state.importShare;
  const yenGap = calculateYenGap(usdJpy);
  const oilGap = ((oil - BASE_OIL) / BASE_OIL) * 100;

  const exporter = 100 + yenGap * 0.8;
  const importer = 100 + yenGap * 0.7 + oilGap * 0.5;
  const traveler = (BASE_USDJPY / usdJpy) * 100;
  const household =
    100 + yenGap * (importShare / 100) * 0.9 + oilGap * (importShare / 100) * 0.8;

  let status: ThemeOutput["status"];
  if (yenGap >= 8 && oilGap >= 10) {
    status = {
      kicker: "誰の世界か",
      label: "輸出は楽、家計は重い",
      description:
        "円安と高いエネルギーが同時に来ています。会社の決算と、スーパーのレシートは、別の顔をします。",
      tone: "warning",
    };
  } else if (yenGap <= -6) {
    status = {
      kicker: "誰の世界か",
      label: "円高の景色",
      description:
        "輸入は楽になり、旅行の円は強くなる一方、輸出企業は価格競争で苦しくなりやすいです。",
      tone: "accent",
    };
  } else {
    status = {
      kicker: "誰の世界か",
      label: "得する人と損する人",
      description:
        "為替は全員に同じ数字でも、立ち位置で意味が変わります。輸入比率が高いほど、家計は為替に敏感です。",
      tone: "default",
    };
  }

  return {
    cards: [
      {
        label: "輸出企業",
        value: `${formatNumber(exporter, 0)}`,
        hint: "150円を100とした競争力",
        tone: exporter >= 100 ? "positive" : "negative",
        graphic: { ratio: ratioInRange(exporter, 60, 160), mark: ratioInRange(100, 60, 160) },
      },
      {
        label: "輸入コスト",
        value: `${formatNumber(importer, 0)}`,
        hint: "円安と原油が重なる",
        tone: importer > 105 ? "warning" : "default",
        graphic: { ratio: ratioInRange(importer, 60, 180), mark: ratioInRange(100, 60, 180) },
      },
      {
        label: "旅先の円",
        value: `${formatNumber(traveler, 0)}`,
        hint: "海外で使える円の力",
        tone: traveler < 95 ? "negative" : "accent",
        graphic: { ratio: ratioInRange(traveler, 50, 150), mark: ratioInRange(100, 50, 150) },
      },
      {
        label: "家計の負担",
        value: `${formatNumber(household, 0)}`,
        hint: `輸入依存 ${formatNumber(importShare, 0)}% のとき`,
        tone: household > 105 ? "warning" : "default",
        graphic: { ratio: ratioInRange(household, 70, 160), mark: ratioInRange(100, 70, 160) },
      },
    ],
    status,
    explanation: [
      `ドル円${formatNumber(usdJpy, 0)}円は、基準150円から見て${formatSigned(yenGap, 1)}%です。`,
      yenGap > 0
        ? "円安は輸出には追い風、輸入と旅行には逆風になりやすい。"
        : "円高は輸入と旅行を楽にし、輸出の値段競争を厳しくしやすい。",
      `原油${formatNumber(oil, 0)}ドルと輸入依存が重なると、家計の数字は為替だけでも決まりません。`,
    ].join(""),
    learningPoint:
      yenGap > 0
        ? "円安は、誰かの利益と誰かの負担を同時に動かす。"
        : "為替は「国が得するか」ではなく、「誰の立場か」で意味が変わる。",
    chart: {
      title: "同じ円安でも、立場で逆向き",
      caption: "150円・原油80ドルを100とした教育用指数",
      bars: [
        { name: "輸出企業", value: exporter, fill: "#0f766e" },
        { name: "輸入コスト", value: importer, fill: "#b45309" },
        { name: "旅先の円", value: traveler, fill: "#0369a1" },
        { name: "家計の負担", value: household, fill: "#7c3aed" },
      ],
    },
  };
}

export const fxTheme: PlayableTheme = {
  id: "fx",
  number: "04",
  title: "為替",
  question: "円安になると、誰が得する？",
  teaser: "ドル円・原油・輸入依存。同じ円安でも、勝ち負けが分かれる。",
  domain: "世界",
  sliderCount: 3,
  interaction: "coupled",
  interactionNote: "為替は全員に同じ数字。原油と輸入比率が、家計側の痛みを変える。",
  defaultValues: { usdJpy: 150, oil: 80, importShare: 30 },
  sliders: [
    {
      key: "usdJpy",
      label: "ドル円",
      min: 75,
      max: 280,
      step: 1,
      unit: "円",
      description: "1ドルを何円で買うか。大きいほど円安",
      lowLabel: "円高",
      highLabel: "円安",
    },
    {
      key: "oil",
      label: "原油価格",
      min: 10,
      max: 160,
      step: 1,
      unit: "ドル",
      description: "エネルギーと輸送の元になる値段",
      lowLabel: "安い",
      highLabel: "高い",
    },
    {
      key: "importShare",
      label: "輸入依存",
      min: 10,
      max: 70,
      step: 1,
      unit: "%",
      description: "家計のうち、海外の値段に触れやすい割合",
      lowLabel: "低い",
      highLabel: "高い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "基準",
      description: "150円 / 原油80ドル",
      values: { usdJpy: 150, oil: 80, importShare: 30 },
    },
    {
      id: "yen-weak",
      label: "円安",
      description: "160円と高い原油",
      values: { usdJpy: 160, oil: 110, importShare: 40 },
    },
    {
      id: "yen-strong",
      label: "円高",
      description: "120円、原油は落ち着く",
      values: { usdJpy: 120, oil: 70, importShare: 30 },
    },
    {
      id: "open-economy",
      label: "輸入だらけ",
      description: "同じ150円でも家計は敏感",
      values: { usdJpy: 150, oil: 100, importShare: 60 },
    },
  ],
  resultHint: "150円・原油80ドルを100とした、立場別の教育用指数です",
  compute,
};
