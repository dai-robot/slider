"use client";

import { useEffect, useMemo, useRef } from "react";
import { ContributionChart } from "@/components/ContributionChart";
import { EraPanel } from "@/components/EraPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { PlayShell } from "@/components/PlayShell";
import { PresetButton } from "@/components/PresetButton";
import { ResultCard } from "@/components/ResultCard";
import { SliderControl } from "@/components/SliderControl";
import { StatusBanner } from "@/components/StatusBanner";
import {
  clampToSliders,
  eraPresetId,
  getEra,
  getEraValues,
  getThemeSliders,
} from "@/lib/eras";
import { useAnimatedValues } from "@/lib/hooks/useAnimatedValues";
import { getPlayableTheme } from "@/lib/themes/catalog";

type ThemePlaygroundProps = {
  themeId: string;
  initialEraId?: string;
};

export function ThemePlayground({
  themeId,
  initialEraId,
}: ThemePlaygroundProps) {
  const theme = getPlayableTheme(themeId);
  if (!theme) return null;

  return <Playground theme={theme} initialEraId={initialEraId} />;
}

function Playground({
  theme,
  initialEraId,
}: {
  theme: NonNullable<ReturnType<typeof getPlayableTheme>>;
  initialEraId?: string;
}) {
  const steps = useMemo(
    () => Object.fromEntries(theme.sliders.map((slider) => [slider.key, slider.step])),
    [theme.sliders],
  );
  const { values, activePresetId, updateField, animateTo } = useAnimatedValues(
    theme.defaultValues,
    steps,
  );
  const result = theme.compute(values);
  const appliedInitialEra = useRef(false);

  useEffect(() => {
    if (appliedInitialEra.current || !initialEraId) return;
    const era = getEra(initialEraId);
    appliedInitialEra.current = true;
    if (!era) return;
    const eraValues = getEraValues(era, theme.id);
    if (!eraValues) return;
    animateTo(
      clampToSliders(eraValues, getThemeSliders(theme.id)),
      eraPresetId(era.id),
    );
  }, [animateTo, initialEraId, theme.id]);

  return (
    <PlayShell
      question={theme.question}
      teaser={theme.teaser}
      toolbar={
        <div className="flex w-max flex-nowrap items-center gap-1.5 lg:w-full lg:flex-wrap lg:gap-1">
          {theme.presets.map((preset) => (
            <PresetButton
              key={preset.id}
              label={preset.label}
              description={preset.description}
              compact
              active={activePresetId === preset.id}
              onClick={() => animateTo(preset.values, preset.id)}
            />
          ))}
          <span className="mx-0.5 h-3.5 w-px bg-slate-200" aria-hidden />
          <EraPanel
            themeId={theme.id}
            activePresetId={activePresetId}
            compact
            onSelect={(next, presetId) => animateTo(next, presetId)}
          />
        </div>
      }
      sliders={theme.sliders.map((config) => (
        <SliderControl
          key={config.key}
          config={config}
          compact
          value={values[config.key] ?? config.min}
          onChange={(value) => updateField(config.key, value)}
        />
      ))}
      results={
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 lg:gap-1.5">
          {result.cards.map((card) => (
            <ResultCard
              key={card.label}
              label={card.label}
              value={card.value}
              hint={card.hint}
              tone={card.tone}
              graphic={card.graphic}
              compact
            />
          ))}
        </div>
      }
      status={
        <StatusBanner
          kicker={result.status.kicker}
          title={result.status.label}
          description={result.status.description}
          tone={result.status.tone}
          compact
        />
      }
      chart={
        result.chart ? (
          <ContributionChart chart={result.chart} compact />
        ) : (
          <p className="flex h-full items-end text-[11px] text-slate-400">
            数値は教育目的の簡易モデルです
          </p>
        )
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
