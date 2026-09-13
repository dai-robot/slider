import { VALUATION_THRESHOLDS } from "@/lib/constants";
import type {
  MarketStatusId,
  SimulationState,
  ValuationLabel,
} from "@/types/simulation";

export type MarketStatusResult = {
  id: MarketStatusId;
  label: string;
  description: string;
};

export function getValuationLabel(gap: number): ValuationLabel {
  if (gap >= VALUATION_THRESHOLDS.veryExpensive) return "かなり割高";
  if (gap >= VALUATION_THRESHOLDS.somewhatExpensive) return "やや割高";
  if (gap <= VALUATION_THRESHOLDS.veryCheap) return "かなり割安";
  if (gap <= VALUATION_THRESHOLDS.somewhatCheap) return "やや割安";
  return "おおむね中立";
}

/**
 * ルールベースの市場状態判定。
 * 単一条件だけで不自然にならないよう、成長・金利・バリュエーションを組み合わせる。
 */
export function calculateMarketStatus(
  state: SimulationState,
  referencePER: number,
): MarketStatusResult {
  const { earningsGrowth, interestRate, peRatio } = state;
  const gap = peRatio - referencePER;

  if (earningsGrowth < 0) {
    return {
      id: "recession",
      label: "景気悪化",
      description:
        "企業利益が減少しています。PERが維持されても日経平均には下押し圧力がかかります。",
    };
  }

  if (gap >= VALUATION_THRESHOLDS.veryExpensive) {
    return {
      id: "overheated",
      label: "過熱",
      description:
        "企業利益に比べ、投資家の期待がかなり高くなっています。バリュエーション調整に注意が必要です。",
    };
  }

  // 高金利 + 弱い成長は、わずかな割高より「金利逆風」として先に出す
  if (interestRate >= 6 && earningsGrowth < 5) {
    return {
      id: "rate_headwind",
      label: "金利逆風",
      description:
        "高い金利が株式の評価を抑えやすい環境です。利益成長が弱いと日経平均は伸びにくくなります。",
    };
  }

  if (
    gap >= VALUATION_THRESHOLDS.somewhatExpensive &&
    interestRate >= 5 &&
    earningsGrowth < 8
  ) {
    return {
      id: "slightly_overheated",
      label: "やや過熱",
      description:
        "金利が高い一方でPERは高めです。利益成長が追いつかないと、日経平均は期待の修正を受けやすくなります。",
    };
  }

  if (earningsGrowth >= 10 && interestRate <= 3 && gap < VALUATION_THRESHOLDS.somewhatExpensive) {
    return {
      id: "growth",
      label: "成長相場",
      description:
        "企業利益の伸びが強く、金利負担も小さいため、日経平均には追い風です。",
    };
  }

  if (gap <= VALUATION_THRESHOLDS.somewhatCheap && earningsGrowth >= 5) {
    return {
      id: "undervalued",
      label: "割安成長",
      description:
        "利益は伸びているのに、市場の評価倍率は控えめです。相対的に余裕のある水準といえます。",
    };
  }

  return {
    id: "neutral",
    label: "中立",
    description:
      "利益成長・金利・PERのバランスはおおむね落ち着いています。個別の変化が日経平均を左右しやすい局面です。",
  };
}

export function generateExplanation(
  state: SimulationState,
  referencePER: number,
  nominalStockPrice: number,
  realStockPrice: number,
): string {
  const { inflationRate, interestRate, earningsGrowth, peRatio } = state;
  const gap = peRatio - referencePER;
  const parts: string[] = [];

  if (earningsGrowth < 0) {
    parts.push(
      `企業利益は${Math.abs(earningsGrowth).toFixed(0)}%減少しています。EPSが下がると、同じPERでも日経平均は押し下げられます。`,
    );
  } else if (earningsGrowth >= 10) {
    parts.push(
      `利益成長率${earningsGrowth.toFixed(0)}%は高めです。日経平均上昇の土台は、企業そのものの利益拡大にあります。`,
    );
  } else if (earningsGrowth >= 5) {
    parts.push(
      `企業利益は${earningsGrowth.toFixed(0)}%増えていますが、上昇幅の多くは成長だけでなく評価倍率にも左右されます。`,
    );
  } else {
    parts.push(
      `利益成長は${earningsGrowth.toFixed(0)}%と控えめです。この環境ではPERの変化が日経平均に大きく効きます。`,
    );
  }

  if (gap >= 8) {
    parts.push(
      `金利${interestRate.toFixed(1)}%の環境でPER${peRatio.toFixed(0)}倍は高い水準です（参考PERは約${referencePER.toFixed(0)}倍）。日経平均の多くが投資家の高い期待に支えられています。`,
    );
  } else if (gap >= 3) {
    parts.push(
      `あなたのPER${peRatio.toFixed(0)}倍は、金利から見た参考PER${referencePER.toFixed(0)}倍よりやや高めです。`,
    );
  } else if (gap <= -8) {
    parts.push(
      `PER${peRatio.toFixed(0)}倍は、金利水準から見た参考PER${referencePER.toFixed(0)}倍よりかなり低めです。`,
    );
  } else if (interestRate >= 6) {
    parts.push(
      `金利${interestRate.toFixed(1)}%は株式評価に逆風になりやすく、参考PERは約${referencePER.toFixed(0)}倍まで下がります。`,
    );
  } else if (interestRate <= 2) {
    parts.push(
      `金利${interestRate.toFixed(1)}%は低めです。将来利益の現在価値が相対的に高く見えやすく、PERも支えられやすくなります。`,
    );
  }

  if (inflationRate >= 5) {
    const drag = nominalStockPrice - realStockPrice;
    parts.push(
      `インフレ${inflationRate.toFixed(1)}%では、日経平均${Math.round(nominalStockPrice).toLocaleString("ja-JP")}に対し実質価値は約${Math.round(realStockPrice).toLocaleString("ja-JP")}（差約${Math.round(drag).toLocaleString("ja-JP")}）です。`,
    );
  } else if (inflationRate < 0) {
    parts.push(
      `デフレ気味の環境では、名目価格が横ばいでも実質購買力は相対的に保たれやすくなります。`,
    );
  }

  if (parts.length === 1) {
    parts.push(
      `日経平均は約${Math.round(nominalStockPrice).toLocaleString("ja-JP")}、実質は約${Math.round(realStockPrice).toLocaleString("ja-JP")}です。スライダーを動かして因果関係を感じてみましょう。`,
    );
  }

  return parts.slice(0, 3).join("");
}

export function generateLearningPoint(
  state: SimulationState,
  referencePER: number,
): string {
  const { inflationRate, interestRate, earningsGrowth, peRatio } = state;
  const gap = peRatio - referencePER;

  if (inflationRate >= 5) {
    return "インフレ時には、名目価格と実質価値を分けて考える。";
  }
  if (gap >= 8) {
    return "日経平均の上昇 ＝ 企業が強くなった、とは限らない。";
  }
  if (interestRate >= 6) {
    return "金利が上がると、将来利益の現在価値は低下しやすい。";
  }
  if (earningsGrowth < 0) {
    return "利益が減れば、PERが変わらなくても日経平均は下がる。";
  }
  if (earningsGrowth >= 10 && gap < 3) {
    return "強い利益成長は、日経平均上昇のいちばん健全なエンジンになる。";
  }
  if (gap <= -5) {
    return "同じ利益でも、市場の期待が低いと日経平均は抑えられる。";
  }
  return "日経平均は「利益」と「期待（PER）」の掛け算で決まる。";
}
