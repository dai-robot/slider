"use client";

import {
  clampToSliders,
  eraIdFromPreset,
  eraPresetId,
  getEra,
  getEraValues,
  getErasForTheme,
  getPresentEra,
  getThemeSliders,
  isEraPresetId,
  PRESENT_ERA_ID,
} from "@/lib/eras";
import { labeledCompareRows } from "@/lib/eras/metrics";
import { EraTrendChart } from "@/components/EraTrendChart";
import { PresetButton } from "@/components/PresetButton";
import type { SliderValues } from "@/types/theme";

type EraPanelProps = {
  themeId: string;
  activePresetId: string | null;
  onSelect: (values: SliderValues, presetId: string) => void;
  compact?: boolean;
};

export function EraPanel({
  themeId,
  activePresetId,
  onSelect,
  compact = false,
}: EraPanelProps) {
  const eras = getErasForTheme(themeId);
  if (eras.length === 0) return null;

  const selectedId = eraIdFromPreset(activePresetId);
  const selected = selectedId ? getEra(selectedId) : undefined;
  const present = getPresentEra();
  const sliders = getThemeSliders(themeId);
  const thenValues = selected
    ? clampToSliders(getEraValues(selected, themeId) ?? {}, sliders)
    : undefined;
  const nowValues = clampToSliders(getEraValues(present, themeId) ?? {}, sliders);
  const showCompare =
    Boolean(selected && thenValues && Object.keys(nowValues).length > 0) &&
    selected?.id !== PRESENT_ERA_ID;
  const rows =
    showCompare && thenValues
      ? labeledCompareRows(themeId, thenValues, nowValues)
      : [];

  const keyRow = rows[0];

  if (compact) {
    return (
      <>
        {eras.map((era) => (
          <PresetButton
            key={era.id}
            label={`${era.year}`}
            description={era.title}
            compact
            active={activePresetId === eraPresetId(era.id)}
            onClick={() => {
              const values = getEraValues(era, themeId);
              if (!values) return;
              onSelect(clampToSliders(values, sliders), eraPresetId(era.id));
            }}
          />
        ))}
        {showCompare && keyRow ? (
          <p className="basis-full truncate text-[11px] text-slate-500">
            {keyRow.label}: 当時 {keyRow.thenValue} → いま {keyRow.nowValue}
            <span className="text-teal-800"> ({keyRow.delta})</span>
          </p>
        ) : selected && isEraPresetId(activePresetId) ? (
          <p className="basis-full truncate text-[11px] text-slate-500">
            {selected.year} {selected.title}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            時代を歩く
          </p>
          <p className="mt-1 text-sm text-slate-500">
            当時の数字に飛ばして、いまと比べる
          </p>
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
        {eras.map((era) => (
          <div key={era.id} className="min-w-[7.5rem] shrink-0">
            <PresetButton
              label={`${era.year}`}
              description={era.title}
              active={activePresetId === eraPresetId(era.id)}
              onClick={() => {
                const values = getEraValues(era, themeId);
                if (!values) return;
                onSelect(clampToSliders(values, sliders), eraPresetId(era.id));
              }}
            />
          </div>
        ))}
      </div>

      {selected && isEraPresetId(activePresetId) ? (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {selected.year} {selected.title} — {selected.note}
          <span className="mt-1 block text-slate-400">{selected.source}</span>
        </p>
      ) : null}

      {showCompare ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <span>項目</span>
            <span>当時</span>
            <span>いま</span>
            <span>差</span>
          </div>
          {rows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-sm ${
                index === 0 ? "bg-teal-50/60 font-semibold text-slate-900" : "text-slate-600"
              }`}
            >
              <span>{row.label}</span>
              <span className="tabular-nums">{row.thenValue}</span>
              <span className="tabular-nums">{row.nowValue}</span>
              <span className="tabular-nums text-teal-800">{row.delta}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4">
        <EraTrendChart themeId={themeId} selectedEraId={selectedId} />
      </div>
    </div>
  );
}
