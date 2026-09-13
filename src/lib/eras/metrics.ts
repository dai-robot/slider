import { calculateSimulation } from "@/lib/calculations";
import { calculateCommuteHours } from "@/lib/themes/commute";
import { calculateMonthlyBill } from "@/lib/themes/energy";
import { calculateMonthlyPayment } from "@/lib/themes/mortgage";
import { calculateFutureValue } from "@/lib/themes/time";
import { calculateRealIncomeChange } from "@/lib/themes/wage";
import { formatNumber, formatPercent, formatSigned } from "@/lib/format";
import type { EraCompareRow } from "@/types/era";
import type { SliderValues } from "@/types/theme";

export type EraTrendPoint = {
  year: number;
  id: string;
  label: string;
  value: number;
};

export function eraKeyMetric(
  themeId: string,
  values: SliderValues,
): { label: string; value: number; display: string } {
  switch (themeId) {
    case "stock": {
      const result = calculateSimulation({
        inflationRate: values.inflationRate,
        interestRate: values.interestRate,
        earningsGrowth: values.earningsGrowth,
        peRatio: values.peRatio,
      });
      return {
        label: "名目株価",
        value: result.nominalStockPrice,
        display: formatNumber(Math.round(result.nominalStockPrice)),
      };
    }
    case "wage": {
      const change = calculateRealIncomeChange(
        values.wageGrowth,
        values.inflation,
      );
      return {
        label: "実質賃金の変化",
        value: change,
        display: formatPercent(change, 1),
      };
    }
    case "mortgage": {
      const monthly = calculateMonthlyPayment(
        values.amount,
        values.rate,
        values.years,
      );
      return {
        label: "毎月の返済",
        value: monthly,
        display: `${formatNumber(Math.round(monthly))}円`,
      };
    }
    case "fx":
      return {
        label: "ドル円",
        value: values.usdJpy,
        display: `${formatNumber(values.usdJpy, 0)}円`,
      };
    case "time": {
      const future = calculateFutureValue(100, values.rate, values.years);
      return {
        label: `${values.years}年後の100万`,
        value: future,
        display: `${formatNumber(future, 1)}万`,
      };
    }
    case "commute": {
      const hours = calculateCommuteHours(values.minutes);
      return {
        label: "年間の通勤",
        value: hours,
        display: `${formatNumber(hours, 0)}時間`,
      };
    }
    case "energy": {
      const bill = calculateMonthlyBill(
        values.price,
        values.kwh,
        values.saving,
      );
      return {
        label: "月の電気代",
        value: bill,
        display: `${formatNumber(Math.round(bill))}円`,
      };
    }
    default:
      return { label: "値", value: 0, display: "—" };
  }
}

export function formatMetricDelta(
  themeId: string,
  thenValue: number,
  nowValue: number,
): string {
  const delta = nowValue - thenValue;
  if (themeId === "wage") {
    return `${formatSigned(delta, 1)}pt`;
  }
  if (themeId === "time") {
    return `${formatSigned(delta, 1)}万`;
  }
  if (themeId === "fx") {
    return `${formatSigned(delta, 0)}円`;
  }
  if (themeId === "commute") {
    return `${formatSigned(delta, 0)}時間`;
  }
  if (themeId === "mortgage" || themeId === "energy" || themeId === "stock") {
    return `${formatSigned(Math.round(delta), 0)}`;
  }
  return formatSigned(delta, 1);
}

const SLIDER_LABELS: Record<string, string> = {
  inflationRate: "インフレ率",
  interestRate: "金利",
  earningsGrowth: "利益成長率",
  peRatio: "PER",
  wageGrowth: "賃上げ率",
  inflation: "インフレ率",
  rate: "金利 / 年利",
  years: "年数",
  amount: "借入額",
  usdJpy: "ドル円",
  oil: "原油",
  importShare: "輸入依存",
  minutes: "片道通勤",
  price: "電気単価",
  kwh: "使用量",
  saving: "節約",
};

const SLIDER_UNITS: Record<string, string> = {
  inflationRate: "%",
  interestRate: "%",
  earningsGrowth: "%",
  peRatio: "倍",
  wageGrowth: "%",
  inflation: "%",
  rate: "%",
  years: "年",
  amount: "万円",
  usdJpy: "円",
  oil: "ドル",
  importShare: "%",
  minutes: "分",
  price: "円/kWh",
  kwh: "kWh",
  saving: "%",
};

export function labeledCompareRows(
  themeId: string,
  thenValues: SliderValues,
  nowValues: SliderValues,
): EraCompareRow[] {
  const thenMetric = eraKeyMetric(themeId, thenValues);
  const nowMetric = eraKeyMetric(themeId, nowValues);
  const rows: EraCompareRow[] = [
    {
      label: thenMetric.label,
      thenValue: thenMetric.display,
      nowValue: nowMetric.display,
      delta: formatMetricDelta(themeId, thenMetric.value, nowMetric.value),
    },
  ];

  for (const key of Object.keys(thenValues)) {
    if (nowValues[key] === undefined) continue;
    const unit = SLIDER_UNITS[key] ?? "";
    const digits = unit === "倍" || unit === "年" || unit === "分" || unit === "円" || unit === "ドル" || unit === "kWh" || unit === "万円" || unit === "円/kWh"
      ? 0
      : 1;
    rows.push({
      label: SLIDER_LABELS[key] ?? key,
      thenValue: `${formatNumber(thenValues[key], digits)}${unit}`,
      nowValue: `${formatNumber(nowValues[key], digits)}${unit}`,
      delta: `${formatSigned(nowValues[key] - thenValues[key], digits)}${unit}`,
    });
  }

  return rows;
}
