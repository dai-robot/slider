"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { EraPanel } from "@/components/EraPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { PlayShell } from "@/components/PlayShell";
import { PresetButton } from "@/components/PresetButton";
import { ResultCard } from "@/components/ResultCard";
import { SliderControl } from "@/components/SliderControl";
import { StatusBanner } from "@/components/StatusBanner";
import { StockPriceChart } from "@/components/StockPriceChart";
import { calculateSimulation } from "@/lib/calculations";
import { DEFAULT_STATE, INITIAL_PRICE, SLIDER_CONFIGS } from "@/lib/constants";
import { formatMultiple, formatNumber } from "@/lib/format";
import { ratioInRange } from "@/lib/math";
import { useAnimatedValues } from "@/lib/hooks/useAnimatedValues";
import {
  clampToSliders,
  eraPresetId,
  getEra,
  getEraValues,
  getThemeSliders,
} from "@/lib/eras";
import { PRESETS, RESET_PRESET } from "@/lib/presets";
import { stockThemeMeta } from "@/lib/themes/stock";
import type { SimulationState } from "@/types/simulation";
import type { ResultTone } from "@/types/theme";

const SLIDER_STEPS = {
  inflationRate: 0.1,
  interestRate: 0.1,
  earningsGrowth: 1,
  peRatio: 1,
};

function statusTone(statusId: string): ResultTone {
  switch (statusId) {
    case "growth":
    case "undervalued":
      return "positive";
    case "overheated":
    case "slightly_overheated":
      return "warning";
    case "recession":
      return "negative";
    case "rate_headwind":
      return "accent";
    default:
      return "default";
  }
}

export function StockSimulator({ initialEraId }: { initialEraId?: string }) {
  const { values, activePresetId, updateField, animateTo } =
    useAnimatedValues(DEFAULT_STATE, SLIDER_STEPS);
  const state = values as SimulationState;
  const result = useMemo(() => calculateSimulation(state), [state]);
  const appliedInitialEra = useRef(false);

  const changeField = useCallback(
    (key: keyof SimulationState, value: number) => {
      updateField(key, value);
    },
    [updateField],
  );

  const goTo = useCallback(
    (next: SimulationState, presetId: string) => {
      animateTo(next, presetId);
    },
    [animateTo],
  );

  useEffect(() => {
    if (appliedInitialEra.current || !initialEraId) return;
    const era = getEra(initialEraId);
    appliedInitialEra.current = true;
    if (!era) return;
    const eraValues = getEraValues(era, "stock");
    if (!eraValues) return;
    animateTo(
      clampToSliders(eraValues, getThemeSliders("stock")),
      eraPresetId(era.id),
    );
  }, [animateTo, initialEraId]);

  return (
    <PlayShell
      question={stockThemeMeta.question}
      teaser={stockThemeMeta.teaser}
      toolbar={
        <div className="flex flex-wrap items-center gap-1">
          <PresetButton
            label={RESET_PRESET.label}
            description={RESET_PRESET.description}
            compact
            active={activePresetId === RESET_PRESET.id}
            onClick={() => goTo(RESET_PRESET.values, RESET_PRESET.id)}
          />
          {PRESETS.map((preset) => (
            <PresetButton
              key={preset.id}
              label={preset.label}
              description={preset.description}
              compact
              active={activePresetId === preset.id}
              onClick={() => goTo(preset.values, preset.id)}
            />
          ))}
          <span className="mx-0.5 h-3.5 w-px bg-slate-200" aria-hidden />
          <EraPanel
            themeId="stock"
            activePresetId={activePresetId}
            compact
            onSelect={(next, presetId) => goTo(next as SimulationState, presetId)}
          />
        </div>
      }
      sliders={SLIDER_CONFIGS.map((config) => (
        <SliderControl
          key={config.key}
          config={config}
          compact
          value={state[config.key as keyof SimulationState]}
          onChange={(value) =>
            changeField(config.key as keyof SimulationState, value)
          }
        />
      ))}
      results={
        <div className="grid grid-cols-2 gap-1.5">
          <ResultCard
            label="名目株価"
            value={formatNumber(Math.round(result.nominalStockPrice))}
            hint={`EPS ${formatNumber(result.eps, 1)} × PER ${formatMultiple(state.peRatio, 0)}`}
            graphic={{
              ratio: ratioInRange(result.nominalStockPrice, 500, 5000),
              mark: ratioInRange(INITIAL_PRICE, 500, 5000),
            }}
            compact
          />
          <ResultCard
            label="実質株価"
            value={formatNumber(Math.round(result.realStockPrice))}
            hint="名目株価 ÷ (1 + インフレ率)"
            tone={
              result.realStockPrice < result.nominalStockPrice * 0.95
                ? "warning"
                : "default"
            }
            graphic={{
              ratio: ratioInRange(result.realStockPrice, 400, 5000),
              mark: ratioInRange(INITIAL_PRICE, 400, 5000),
            }}
            compact
          />
          <ResultCard
            label="参考PER"
            value={formatMultiple(result.referencePER, 0)}
            hint={`金利 ${state.interestRate.toFixed(1)}% からの簡易推計`}
            tone="accent"
            graphic={{
              ratio: ratioInRange(result.referencePER, 8, 35),
              mark: ratioInRange(state.peRatio, 8, 35),
            }}
            compact
          />
          <ResultCard
            label="市場状態"
            value={result.marketStatus}
            hint={result.valuationLabel}
            tone={statusTone(result.marketStatusId)}
            graphic={{
              ratio: {
                growth: 0.88,
                undervalued: 0.72,
                neutral: 0.5,
                slightly_overheated: 0.38,
                rate_headwind: 0.32,
                overheated: 0.2,
                recession: 0.12,
              }[result.marketStatusId] ?? 0.5,
            }}
            compact
          />
        </div>
      }
      status={
        <StatusBanner
          kicker="市場状態"
          title={result.marketStatus}
          description={`${result.marketStatusDescription} · PER ${formatMultiple(state.peRatio, 0)} vs 参考 ${formatMultiple(result.referencePER, 0)}（${result.valuationLabel}）`}
          tone={statusTone(result.marketStatusId)}
          compact
        />
      }
      chart={
        <StockPriceChart
          decomposition={result.decomposition}
          nominalStockPrice={result.nominalStockPrice}
          compact
        />
      }
      footer={
        <ExplanationPanel
          explanation={result.explanation}
          learningPoint={result.learningPoint}
          compact
        />
      }
    />
  );
}
