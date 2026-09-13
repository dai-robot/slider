import type { Metadata } from "next";
import { ErasHome } from "@/components/ErasHome";

export const metadata: Metadata = {
  title: "時代を歩く | スライダー",
  description:
    "石油危機、バブル、円高、コロナ、インフレ。当時の数字に飛ばして、いまとの違いを触って見る。",
};

export default function ErasPage() {
  return (
    <main className="flex-1">
      <ErasHome />
    </main>
  );
}
