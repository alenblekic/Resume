"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { AnalysisResult } from "@/lib/types";
import UploadZone from "./components/UploadZone";
import JobDescriptionInput from "./components/JobDescriptionInput";
import LoadingScreen from "./components/LoadingScreen";
import ResultsDashboard from "./components/ResultsDashboard";
import GlitchText from "./components/fx/GlitchText";
import TypeWriter from "./components/fx/TypeWriter";
import HudFrame from "./components/fx/HudFrame";

export default function Home() {
  const {
    appState,
    resumeText,
    jobDescription,
    errorMessage,
    startAnalysis,
    setResults,
    setError,
    reset,
  } = useAppStore();

  const canAnalyze = resumeText.trim().length > 0 && jobDescription.trim().length > 0;

  async function handleAnalyze() {
    startAnalysis();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error ?? "Something went wrong analyzing your resume. Please try again."
        );
      }
      const results: AnalysisResult = await res.json();
      setResults(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong analyzing your resume. Please try again."
      );
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
      <AnimatePresence mode="wait">
        {appState === "idle" && (
          <motion.div
            key="idle"
            className="w-full max-w-2xl flex flex-col gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <header className="text-center">
              <p className="hud-label text-[10px] text-accent/50 mb-3">
                ┌ hiring surveillance system v2.0 ┐
              </p>
              <h1 className="hud-label text-3xl sm:text-5xl font-normal accent-text">
                <GlitchText text="RESUME INTELLIGENCE" />
              </h1>
              <p className="mt-4 text-xs sm:text-sm text-foreground/60 max-w-lg mx-auto min-h-[2.5em]">
                <TypeWriter
                  text="> 4 AI hiring personas will process your document: recruiter // ATS // hiring manager // interviewer"
                  speed={14}
                  delay={400}
                />
              </p>
            </header>

            <UploadZone />
            <JobDescriptionInput />

            <motion.button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              whileHover={canAnalyze ? { scale: 1.01 } : undefined}
              whileTap={canAnalyze ? { scale: 0.99 } : undefined}
              className={`hud-label group w-full border py-4 text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                canAnalyze
                  ? "cursor-pointer border-accent text-accent hover:bg-accent hover:text-white hover:shadow-[0_0_35px_rgba(255,59,78,0.4)]"
                  : "cursor-not-allowed border-foreground/15 text-foreground/25"
              }`}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
              Initiate analysis
            </motion.button>
          </motion.div>
        )}

        {appState === "analyzing" && <LoadingScreen key="analyzing" />}

        {appState === "results" && <ResultsDashboard key="results" />}

        {appState === "error" && (
          <motion.div
            key="error"
            className="w-full max-w-md text-center flex flex-col gap-6 mt-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <HudFrame className="p-8" glow={false}>
              <AlertTriangle
                className="w-10 h-10 text-accent mx-auto mb-4"
                strokeWidth={1.5}
              />
              <p className="hud-label text-lg text-accent mb-3">System fault</p>
              <p className="text-sm text-foreground/70">{errorMessage}</p>
            </HudFrame>
            <button
              onClick={reset}
              className="hud-label cursor-pointer border border-foreground/25 text-foreground/70 hover:border-accent hover:text-accent py-3 text-sm transition-colors"
            >
              ▸ Reboot session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
