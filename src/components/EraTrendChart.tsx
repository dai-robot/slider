"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getErasForTheme, getEraValues } from "@/lib/eras";
import { eraKeyMetric } from "@/lib/eras/metrics";
import { formatNumber } from "@/lib/format";

type EraTrendChartProps = {
  themeId: string;
  selectedEraId: string | null;
};

export function EraTrendChart({ themeId, selectedEraId }: EraTrendChartProps) {
  const data = getErasForTheme(themeId).flatMap((era) => {
    const values = getEraValues(era, themeId);
    if (!values) return [];
    const metric = eraKeyMetric(themeId, values);
    return [
      {
        year: era.year,
        id: era.id,
        value: metric.value,
        label: metric.label,
      },
    ];
  });

  if (data.length < 2) return null;

  const selected = data.find((point) => point.id === selectedEraId) ?? data[data.length - 1];
  const metricLabel = data[0]?.label ?? "推移";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="mb-3">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          過去からいま
        </h3>
        <p className="mt-1 text-sm text-slate-500">{metricLabel}の時代ごとの変化</p>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(value: number) => formatNumber(value, 0)}
              width={48}
            />
            <Tooltip
              formatter={(value) => [formatNumber(Number(value ?? 0), 1), metricLabel]}
              labelFormatter={(year) => `${year}年`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#0f766e" }}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={selected.year}
              y={selected.value}
              r={6}
              fill="#0f766e"
              stroke="#fff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
