"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  Eye,
  KeyRound,
  MessagesSquare,
  Radar,
  ScanLine,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import ResultCard from "./ResultCard";
import ScoreRing from "./ScoreRing";
import KeywordsList from "./KeywordsList";
import WeakSections from "./WeakSections";
import SalaryWidget from "./SalaryWidget";
import QuestionsAccordion from "./QuestionsAccordion";
import ProbabilityMeter from "./ProbabilityMeter";

export default function ResultsDashboard() {
  const { results, reset } = useAppStore();
  if (!results) return null;

  const { recruiter, ats, hiringManager, interviewer, salaryProbability } = results;

  return (
    <motion.div
      className="w-full max-w-5xl flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="hud-label text-lg sm:text-xl accent-text">
          {"// Analysis complete"}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {ats && (
            <div className="hidden sm:flex gap-2">
              <span className="hud-label border border-cyan/40 text-cyan px-2.5 py-1 text-[10px]">
                [ {ats.detected_level} ]
              </span>
              <span className="hud-label border border-cyan/40 text-cyan px-2.5 py-1 text-[10px]">
                [ {ats.detected_industry} ]
              </span>
            </div>
          )}
          <button
            onClick={reset}
            className="hud-label cursor-pointer border border-foreground/25 text-foreground/70 hover:border-accent hover:text-accent text-[11px] px-4 py-2.5 transition-colors"
          >
            ▸ New scan
          </button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <ResultCard title="ATS Score" icon={Radar} failed={!ats}>
          {ats && (
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={ats.score} />
              <span
                className={`hud-label text-xs ${
                  ats.score >= 70 ? "text-cyan" : "text-warn"
                }`}
              >
                [ STATUS: {ats.score >= 70 ? "GOOD" : "NEEDS WORK"} ]
              </span>
            </div>
          )}
        </ResultCard>

        <ResultCard title="Recruiter First Pass" icon={Eye} failed={!recruiter}>
          {recruiter && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground/95">
                &ldquo;{recruiter.first_impression}&rdquo;
              </p>
              <ul className="flex flex-col gap-1.5">
                {recruiter.strengths.map((s) => (
                  <li key={s} className="text-xs text-foreground/70 flex gap-2">
                    <span className="text-cyan shrink-0">+</span> {s}
                  </li>
                ))}
                {recruiter.red_flags.map((r) => (
                  <li key={r} className="text-xs text-foreground/70 flex gap-2">
                    <span className="text-accent shrink-0">!</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ResultCard>

        <ResultCard title="Missing Keywords" icon={KeyRound} failed={!ats}>
          {ats && <KeywordsList keywords={ats.missing_keywords} />}
        </ResultCard>

        <ResultCard title="Weak Sections" icon={Wrench} failed={!hiringManager}>
          {hiringManager && <WeakSections sections={hiringManager.weak_sections} />}
        </ResultCard>

        <ResultCard title="Salary Estimate" icon={Banknote} failed={!salaryProbability}>
          {salaryProbability && <SalaryWidget data={salaryProbability} />}
        </ResultCard>

        <ResultCard
          title="Interview Questions"
          icon={MessagesSquare}
          failed={!interviewer}
        >
          {interviewer && <QuestionsAccordion data={interviewer} />}
        </ResultCard>

        <ResultCard
          title="Interview Probability"
          icon={TrendingUp}
          failed={!salaryProbability}
          className="md:col-span-2 lg:col-span-3"
        >
          {salaryProbability && <ProbabilityMeter data={salaryProbability} />}
        </ResultCard>
      </motion.div>

      <p className="hud-label text-center text-[9px] text-foreground/25 flex items-center justify-center gap-2">
        <ScanLine className="w-3 h-3" strokeWidth={1.5} />
        Scan complete — no data retained
      </p>
    </motion.div>
  );
}
