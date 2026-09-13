"use client";

type PresetButtonProps = {
  label: string;
  description?: string;
  active?: boolean;
  onClick: () => void;
  compact?: boolean;
};

export function PresetButton({
  label,
  description,
  active = false,
  onClick,
  compact = false,
}: PresetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={description}
      className={
        compact
          ? `rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              active
                ? "border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-700/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-600/40 hover:bg-teal-50/60"
            }`
          : `rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              active
                ? "border-teal-700 bg-teal-700 text-white shadow-md shadow-teal-700/20"
                : "border-slate-200 bg-white text-slate-800 hover:border-teal-600/40 hover:bg-teal-50/60"
            }`
      }
    >
      <span className={compact ? undefined : "block text-sm font-semibold"}>
        {label}
      </span>
      {!compact && description ? (
        <span
          className={`mt-0.5 block text-xs ${active ? "text-teal-50" : "text-slate-500"}`}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
