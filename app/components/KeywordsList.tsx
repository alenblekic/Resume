"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { MissingKeyword } from "@/lib/types";

export default function KeywordsList({ keywords }: { keywords: MissingKeyword[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (keywords.length === 0) {
    return (
      <p className="flex items-center gap-2 text-xs text-cyan">
        <Check className="w-4 h-4" strokeWidth={2} />
        No critical keywords missing — full coverage.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {keywords.map((k) => {
        const isOpen = expanded === k.keyword;
        const critical = k.importance === "critical";
        const color = critical ? "#ff3b4e" : "#ffb300";
        return (
          <li key={k.keyword}>
            <button
              onClick={() => setExpanded(isOpen ? null : k.keyword)}
              className="w-full text-left cursor-pointer group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="hud-label inline-flex items-center gap-2 px-2.5 py-1 text-[11px] border whitespace-nowrap"
                  style={{
                    color,
                    borderColor: `${color}55`,
                    background: `${color}0d`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 hud-blink"
                    style={{ background: color }}
                  />
                  [ {k.keyword} ]
                </span>
                <span className="hud-label text-[9px] text-foreground/30">
                  {k.importance}
                </span>
                <ChevronDown
                  className={`ml-auto w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/60 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  className="text-xs text-foreground/60 mt-1.5 ml-1 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <span className="text-cyan">&gt;&gt; FIX:</span> {k.suggestion}
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
