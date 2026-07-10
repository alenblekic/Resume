"use client";

import { Check } from "lucide-react";
import type { WeakSection } from "@/lib/types";

export default function WeakSections({ sections }: { sections: WeakSection[] }) {
  if (sections.length === 0) {
    return (
      <p className="flex items-center gap-2 text-xs text-cyan">
        <Check className="w-4 h-4" strokeWidth={2} />
        No weak sections detected — document integrity high.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {sections.map((s, i) => (
        <li key={`${s.section}-${i}`} className="border-l-2 border-warn/60 pl-3">
          <p className="hud-label text-xs text-foreground/90">
            <span className="text-warn">DX-{String(i + 1).padStart(2, "0")}</span>{" "}
            {s.section}
          </p>
          <p className="text-xs text-foreground/50 mt-1">{s.issue}</p>
          <p className="text-xs text-cyan/90 mt-1">
            <span className="hud-label">&gt;&gt; Fix:</span> {s.fix}
          </p>
        </li>
      ))}
    </ul>
  );
}
