import { formatNumber } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import type { PlayableTheme, SliderValues, ThemeOutput } from "@/types/theme";

export function calculateMonthlyBill(
  price: number,
  kwh: number,
  saving: number,
): number {
  return price * kwh * (1 - saving / 100);
}

function compute(state: SliderValues): ThemeOutput {
  const price = state.price;
  const kwh = state.kwh;
  const saving = state.saving;
  const monthly = calculateMonthlyBill(price, kwh, saving);
  const annual = monthly * 12;
  const noSaving = calculateMonthlyBill(price, kwh, 0);
  const saved = noSaving - monthly;
  const priceUp = calculateMonthlyBill(price * 1.1, kwh, saving) - monthly;

  let status: ThemeOutput["status"];
  if (price >= 40 && saving < 10) {
    status = {
      kicker: "エネルギーの状態",
      label: "単価に押される",
      description:
        "使う量を変えていなくても、単価が上がると請求は増えます。節約は、単価の上昇を一部打ち消します。",
      tone: "warning",
    };
  } else if (saving >= 25) {
    status = {
      kicker: "エネルギーの状態",
      label: "使う側で抵抗できる",
      description:
        "断熱や使い方は、単価が上がった世界でも請求を押し戻します。3つの数字は、足し算ではなく掛け算です。",
      tone: "positive",
    };
  } else {
    status = {
      kicker: "エネルギーの状態",
      label: "単価 × 使用量 × 節約",
      description:
        "電気代は3つの積です。どれか1本を動かしても請求は変わり、2本同時だと打ち消しや増幅が起きます。",
      tone: "accent",
    };
  }

  return {
    cards: [
      {
        label: "今月の電気代",
        value: `${formatNumber(Math.round(monthly))}円`,
        hint: `${formatNumber(price, 0)}円/kWh × ${formatNumber(kwh, 0)}kWh`,
        graphic: { ratio: ratioInRange(monthly, 2000, 28000), mark: ratioInRange(10000, 2000, 28000) },
      },
      {
        label: "年間",
        value: `${formatNumber(Math.round(annual / 10000), 1)}万`,
        hint: "同じ使い方が12ヶ月続いたとき",
        tone: "accent",
        graphic: { ratio: ratioInRange(annual / 10000, 2, 30) },
      },
      {
        label: "節約の効果",
        value: `-${formatNumber(Math.round(saved))}円`,
        hint: "何もしない月と比べて",
        tone: saved > 0 ? "positive" : "default",
        graphic: { ratio: ratioInRange(saved, 0, 8000) },
      },
      {
        label: "単価が10%上がると",
        value: `+${formatNumber(Math.round(priceUp))}円`,
        hint: "使用量と節約が同じとき",
        tone: "warning",
        graphic: { ratio: ratioInRange(priceUp, 0, 4000) },
      },
    ],
    status,
    explanation: [
      `今月の電気代は約${formatNumber(Math.round(monthly))}円です。`,
      saving > 0
        ? `節約${formatNumber(saving, 0)}%は、単価と使用量の積を小さくします。何もしない月より約${formatNumber(Math.round(saved))}円軽い。`
        : "節約が0%だと、単価と使用量の変化がそのまま請求になります。",
      `単価だけ10%上がると、月々は約${formatNumber(Math.round(priceUp))}円増えます。使用量を減らすか、断熱で打ち返せます。`,
    ].join(""),
    learningPoint:
      saving > 0
        ? "エネルギー価格は外から来る。使う量と断熱は、こちら側のスライダー。"
        : "電気代は、単価のせいにも、使い方のせいにもできる。",
    chart: {
      title: "請求の内訳感",
      caption: "節約しない場合と、今の設定",
      bars: [
        { name: "節約なし", value: noSaving, fill: "#94a3b8" },
        { name: "いまの請求", value: monthly, fill: "#0f766e" },
      ],
    },
  };
}

export const energyTheme: PlayableTheme = {
  id: "energy",
  number: "07",
  title: "エネルギー",
  question: "電気代は、単価のせい？ 使い方のせい？",
  teaser: "単価・使用量・節約。3つは掛け算なので、同時に動かすと打ち消し合う。",
  domain: "エネルギー",
  sliderCount: 3,
  interaction: "coupled",
  interactionNote: "単価が上がっても、使用量や断熱で一部は戻せる。逆もまた真。",
  defaultValues: { price: 31, kwh: 350, saving: 10 },
  sliders: [
    {
      key: "price",
      label: "電気の単価",
      min: 10,
      max: 55,
      step: 1,
      unit: "円/kWh",
      description: "1kWhあたりの値段。燃料や為替の影響を受けやすい",
      lowLabel: "安い",
      highLabel: "高い",
    },
    {
      key: "kwh",
      label: "使用量",
      min: 150,
      max: 700,
      step: 10,
      unit: "kWh",
      description: "1ヶ月に使う電気の量。季節や家族の人数で変わる",
      lowLabel: "少ない",
      highLabel: "多い",
    },
    {
      key: "saving",
      label: "節約・断熱",
      min: 0,
      max: 40,
      step: 1,
      unit: "%",
      description: "使い方や断熱で、何%分を減らせているか",
      lowLabel: "なし",
      highLabel: "強い",
    },
  ],
  presets: [
    {
      id: "default",
      label: "標準の月",
      description: "31円 / 350kWh / 10%",
      values: { price: 31, kwh: 350, saving: 10 },
    },
    {
      id: "summer",
      label: "夏の冷房",
      description: "使う量が増える",
      values: { price: 33, kwh: 520, saving: 5 },
    },
    {
      id: "price-shock",
      label: "単価ショック",
      description: "燃料高の月",
      values: { price: 48, kwh: 350, saving: 10 },
    },
    {
      id: "insulated",
      label: "断熱した家",
      description: "同じ単価でも請求は下がる",
      values: { price: 31, kwh: 350, saving: 30 },
    },
  ],
  resultHint: "燃料調整や再エネ賦課金をまとめた、教育用の単純な掛け算です",
  compute,
};
