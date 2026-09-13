"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { easeOutCubic, lerp, snapValues } from "@/lib/math";

const PRESET_ANIMATION_MS = 320;

export function useAnimatedValues(
  initial: Record<string, number>,
  steps: Record<string, number>,
) {
  const [values, setValues] = useState(initial);
  const [activePresetId, setActivePresetId] = useState<string | null>("default");
  const animationRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  const updateField = useCallback(
    (key: string, value: number) => {
      stopAnimation();
      setActivePresetId(null);
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [stopAnimation],
  );

  const animateTo = useCallback(
    (next: Record<string, number>, presetId: string) => {
      stopAnimation();
      setActivePresetId(presetId);

      const from = { ...values };
      const target = { ...from, ...next };
      const start = performance.now();

      const tick = (now: number) => {
        const raw = Math.min(1, (now - start) / PRESET_ANIMATION_MS);
        const t = easeOutCubic(raw);
        const interpolated: Record<string, number> = {};
        for (const key of Object.keys(target)) {
          interpolated[key] = lerp(from[key] ?? target[key], target[key], t);
        }

        if (raw >= 1) {
          setValues(snapValues(target, steps));
          animationRef.current = null;
          return;
        }

        setValues(interpolated);
        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);
    },
    [steps, stopAnimation, values],
  );

  return {
    values,
    activePresetId,
    updateField,
    animateTo,
    stopAnimation,
  };
}
