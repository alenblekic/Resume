"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { SalaryProbabilityResult } from "@/lib/types";
import ScoreRing from "./ScoreRing";

export default function ProbabilityMeter({ data }: { data: SalaryProbabilityResult }) {
  const { probability, probability_factors } = data;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <ScoreRing score={probability} size={120} label="Interview odds" />

      <div className="flex-1 flex flex-col gap-4 w-full">
        {probability_factors.positive.length > 0 && (
          <div>
            <p className="hud-label flex items-center gap-1.5 text-[10px] text-cyan/80 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
              Signal boost
            </p>
            <ul className="flex flex-col gap-1">
              {probability_factors.positive.map((f, i) => (
                <motion.li
                  key={f}
                  className="text-xs text-foreground/70 flex gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                >
                  <span className="text-cyan shrink-0">+</span> {f}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        {probability_factors.negative.length > 0 && (
          <div>
            <p className="hud-label flex items-center gap-1.5 text-[10px] text-accent/80 mb-1.5">
              <TrendingDown className="w-3.5 h-3.5" strokeWidth={2} />
              Signal drag
            </p>
            <ul className="flex flex-col gap-1">
              {probability_factors.negative.map((f, i) => (
                <motion.li
                  key={f}
                  className="text-xs text-foreground/70 flex gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.12 }}
                >
                  <span className="text-accent shrink-0">−</span> {f}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
