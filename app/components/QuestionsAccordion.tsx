"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { InterviewerResult } from "@/lib/types";

const TABS = [
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "system_design", label: "Sys Design" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function QuestionsAccordion({ data }: { data: InterviewerResult }) {
  const [activeTab, setActiveTab] = useState<TabId>("technical");
  const questions = data[activeTab];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border border-accent/20">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`hud-label relative flex-1 cursor-pointer px-2 py-2 text-[10px] transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-accent"
                : "text-foreground/40 hover:text-foreground/70"
            }`}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="question-tab-beam"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                style={{ boxShadow: "0 0 8px #ff3b4e" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={activeTab}
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
        >
          {questions.length === 0 ? (
            <li className="text-xs text-foreground/40">No questions generated.</li>
          ) : (
            questions.map((q, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-foreground/80 leading-relaxed">
                <span className="hud-label text-cyan shrink-0">
                  Q-{String(i + 1).padStart(2, "0")}
                </span>
                {q}
              </li>
            ))
          )}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
