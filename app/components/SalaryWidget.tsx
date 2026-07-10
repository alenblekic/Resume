"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { SalaryProbabilityResult } from "@/lib/types";

function formatSalary(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
    notation: amount >= 1_000_000 ? "compact" : "standard",
  }).format(amount);
}

function useCountUp(target: number, reduced: boolean): number {
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) return; // value already initialized to target
    const controls = animate(0, target, {
      duration: 1.2,
      delay: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, reduced]);
  return value;
}

export default function SalaryWidget({ data }: { data: SalaryProbabilityResult }) {
  const reduced = useReducedMotion() ?? false;
  const low = useCountUp(data.salary_low, reduced);
  const high = useCountUp(data.salary_high, reduced);

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <p className="hud-label text-lg sm:text-2xl accent-text flex flex-wrap items-baseline justify-center gap-x-2 text-center">
        <span className="whitespace-nowrap">{formatSalary(low, data.salary_currency)}</span>
        <span className="text-foreground/30">—</span>
        <span className="whitespace-nowrap">{formatSalary(high, data.salary_currency)}</span>
      </p>
      <p className="hud-label text-[10px] text-foreground/40">
        Est. compensation band · {data.salary_currency}
      </p>
    </div>
  );
}
