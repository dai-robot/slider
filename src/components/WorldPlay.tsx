"use client";

import { useSearchParams } from "next/navigation";
import { StockSimulator } from "@/components/StockSimulator";
import { ThemePlayground } from "@/components/ThemePlayground";

export function WorldPlay({ id }: { id: string }) {
  const era = useSearchParams().get("era") ?? undefined;

  if (id === "stock") {
    return <StockSimulator initialEraId={era} />;
  }

  return <ThemePlayground themeId={id} initialEraId={era} />;
}
