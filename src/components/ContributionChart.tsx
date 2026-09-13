"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/format";
import type { ThemeChart } from "@/types/theme";

type ContributionChartProps = {
  chart: ThemeChart;
  compact?: boolean;
};

export function ContributionChart({
  chart,
  compact = false,
}: ContributionChartProps) {
  return (
    <div
      className={
        compact
          ? "flex h-full min-h-0 flex-col rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm shadow-slate-200/30"
          : "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"
      }
    >
      <div className={compact ? "mb-2 shrink-0" : "mb-4"}>
        <h3
          className={
            compact
              ? "font-display text-sm font-semibold text-slate-900"
              : "font-display text-lg font-semibold text-slate-900"
          }
        >
          {chart.title}
        </h3>
        <p
          className={
            compact
              ? "mt-0.5 line-clamp-2 text-[11px] text-slate-500"
              : "mt-1 text-sm text-slate-500"
          }
        >
          {chart.caption}
        </p>
      </div>
      <div className={compact ? "min-h-0 w-full flex-1" : "h-56 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart.bars}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: compact ? 11 : 12 }}
              tickFormatter={(value: number) => formatNumber(value, 0)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={compact ? 80 : 88}
              tick={{ fill: "#475569", fontSize: compact ? 11 : 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
              formatter={(value) => [formatNumber(Number(value ?? 0), 1), ""]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={compact ? 22 : 22}>
              {chart.bars.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
