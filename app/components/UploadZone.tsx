"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, FileText, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { extractText, ParseError } from "@/lib/parsers/extract-text";
import HudFrame from "./fx/HudFrame";

export default function UploadZone() {
  const { resumeText, resumeFileName, setResume, clearResume } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [parseError, setParseError] = useState("");
  const [showPasteFallback, setShowPasteFallback] = useState(false);
  const [pastedText, setPastedText] = useState("");

  async function handleFile(file: File) {
    setParsing(true);
    setParseError("");
    setScanned(false);
    try {
      const text = await extractText(file);
      setResume(text, file.name);
      setShowPasteFallback(false);
      setScanned(true);
    } catch (err) {
      clearResume();
      setParseError(
        err instanceof ParseError ? err.message : "Could not read this file."
      );
      setShowPasteFallback(true);
    } finally {
      setParsing(false);
    }
  }

  function handlePaste(text: string) {
    setPastedText(text);
    if (text.trim().length > 0) {
      setResume(text.trim(), "pasted_input.txt");
    } else {
      clearResume();
    }
  }

  const hasResume = resumeText.length > 0;
  const lineCount = hasResume ? resumeText.split("\n").length : 0;

  return (
    <div className="flex flex-col gap-3">
      <span className="hud-label text-xs text-accent/70">▸ Subject document</span>

      <HudFrame>
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload resume — PDF, DOCX, or TXT"
          onClick={() => !parsing && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !parsing) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`relative cursor-pointer overflow-hidden p-8 text-center transition-colors min-h-[132px] flex flex-col items-center justify-center ${
            dragging ? "bg-accent/10" : "hover:bg-accent/[0.04]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          {/* scan sweep on successful parse */}
          <AnimatePresence>
            {scanned && !reduced && (
              <motion.div
                aria-hidden
                className="absolute inset-x-0 h-16 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(255,59,78,0.25), transparent)",
                }}
                initial={{ top: "-20%" }}
                animate={{ top: "120%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                onAnimationComplete={() => setScanned(false)}
              />
            )}
          </AnimatePresence>

          {parsing ? (
            <p className="hud-label text-sm text-cyan animate-pulse">
              Ingesting document…
            </p>
          ) : dragging ? (
            <div className="flex flex-col items-center gap-2">
              <Crosshair className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <p className="hud-label text-sm accent-text">Target acquired — release</p>
            </div>
          ) : hasResume ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <FileText className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <span className="text-sm text-accent">
                &gt; {resumeFileName}{" "}
                <span className="text-foreground/50">
                  {`// ${lineCount} LINES INGESTED`}
                </span>
              </span>
              <button
                aria-label="Remove resume"
                onClick={(e) => {
                  e.stopPropagation();
                  clearResume();
                  setPastedText("");
                }}
                className="cursor-pointer p-2 text-foreground/40 hover:text-accent transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <>
              <FileText
                className="w-8 h-8 text-accent/60 mb-3"
                strokeWidth={1.25}
              />
              <p className="hud-label text-sm text-foreground/90">
                Drop resume into scanner
              </p>
              <p className="text-xs text-foreground/40 mt-1.5">
                or click to browse — PDF / DOCX / TXT
              </p>
            </>
          )}
        </div>
      </HudFrame>

      {parseError && (
        <p className="text-xs text-warn">
          <span className="hud-label">⚠ Parse fault:</span> {parseError}
        </p>
      )}

      {showPasteFallback && !hasResume && (
        <textarea
          value={pastedText}
          onChange={(e) => handlePaste(e.target.value)}
          placeholder="$ paste_resume_text_here"
          rows={8}
          aria-label="Paste resume text"
          className="hud-panel p-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent resize-y bg-transparent"
        />
      )}
    </div>
  );
}
