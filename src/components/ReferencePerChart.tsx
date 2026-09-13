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
import { calculateReferencePER } from "@/lib/calculations";
import { formatMultiple, formatPercent } from "@/lib/format";

type ReferencePerChartProps = {
  interestRate: number;
  userPER: number;
};

const RATE_POINTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ReferencePerChart({
  interestRate,
  userPER,
}: ReferencePerChartProps) {
  const data = RATE_POINTS.map((rate) => ({
    rate,
    referencePER: calculateReferencePER(rate),
  }));
  const currentRef = calculateReferencePER(interestRate);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          金利と参考PER
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          教育用の簡易モデル（厳密な金融モデルではありません）
        </p>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="rate"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(v: number) => `${v}%`}
              label={{
                value: "金利",
                position: "insideBottomRight",
                offset: -2,
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <YAxis
              domain={[5, 40]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(v: number) => `${v}x`}
            />
            <Tooltip
              formatter={(value) => [
                formatMultiple(Number(value ?? 0), 0),
                "参考PER",
              ]}
              labelFormatter={(label) => `金利 ${formatPercent(Number(label), 0)}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="referencePER"
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={interestRate}
              y={currentRef}
              r={5}
              fill="#0f766e"
              stroke="#fff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>
          現在の金利{" "}
          <strong className="tabular-nums text-slate-900">
            {formatPercent(interestRate, 1)}
          </strong>
        </span>
        <span>
          参考PER{" "}
          <strong className="tabular-nums text-slate-900">
            {formatMultiple(currentRef, 0)}
          </strong>
        </span>
        <span>
          あなたのPER{" "}
          <strong className="tabular-nums text-slate-900">
            {formatMultiple(userPER, 0)}
          </strong>
        </span>
      </div>
    </div>
  );
}
