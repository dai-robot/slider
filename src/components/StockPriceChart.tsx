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
import { formatNumber, formatSigned } from "@/lib/format";
import type { PriceDecomposition } from "@/types/simulation";

type StockPriceChartProps = {
  decomposition: PriceDecomposition;
  nominalStockPrice: number;
  compact?: boolean;
};

export function StockPriceChart({
  decomposition,
  nominalStockPrice,
  compact = false,
}: StockPriceChartProps) {
  const data = [
    {
      name: "利益の効果",
      value: decomposition.earningsEffect,
      fill: "#0f766e",
    },
    {
      name: "PERの効果",
      value: decomposition.peEffect,
      fill: "#0369a1",
    },
    {
      name: "インフレの影響",
      value: -decomposition.inflationDrag,
      fill: "#b45309",
    },
  ];

  return (
    <div
      className={
        compact
          ? "flex h-full min-h-0 flex-col rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm shadow-slate-200/30"
          : "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"
      }
    >
      <div
        className={
            compact
              ? "mb-2 flex shrink-0 items-baseline justify-between gap-2"
              : "mb-4 flex flex-wrap items-end justify-between gap-2"
        }
      >
        <div>
          <h3
            className={
                compact
                  ? "font-display text-sm font-semibold text-slate-900"
                  : "font-display text-lg font-semibold text-slate-900"
            }
          >
            日経平均の構成
          </h3>
          <p
            className={
              compact
                ? "mt-0.5 text-[11px] text-slate-500"
                : "mt-1 text-sm text-slate-500"
            }
          >
            基準 {formatNumber(decomposition.basePrice)} からの変化
          </p>
        </div>
        <p
          className={
            compact
              ? "text-[11px] tabular-nums text-slate-600"
              : "text-sm tabular-nums text-slate-600"
          }
        >
          日経平均{" "}
          <span className="font-semibold text-slate-900">
            {formatNumber(Math.round(nominalStockPrice))}
          </span>
        </p>
      </div>

      <div className={compact ? "min-h-0 w-full flex-1" : "h-56 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: compact ? 11 : 12 }}
              tickFormatter={(v: number) => formatSigned(v, 0)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={compact ? 84 : 96}
              tick={{ fill: "#475569", fontSize: compact ? 11 : 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
              formatter={(value) => [
                formatSigned(Number(value ?? 0), 0),
                "寄与",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {compact ? null : (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          利益の効果とPERの効果の合計が、基準の日経平均からの名目変化です。インフレの影響は実質価値の目減りを示します。
        </p>
      )}
    </div>
  );
}
