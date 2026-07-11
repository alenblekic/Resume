"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, FileText, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { extractText, ParseError, type ParseErrorCode } from "@/lib/parsers/extract-text";
import HudFrame from "./fx/HudFrame";

export default function UploadZone() {
  const { resumeText, resumeFileName, setResume, clearResume } = useAppStore();
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [scanned, setScanned] = useState(false);
  // the code (not the message) is stored so the text re-localizes on toggle
  const [parseError, setParseError] = useState<ParseErrorCode | "generic" | null>(null);
  const [showPasteFallback, setShowPasteFallback] = useState(false);
  const [pastedText, setPastedText] = useState("");

  async function handleFile(file: File) {
    setParsing(true);
    setParseError(null);
    setScanned(false);
    try {
      const text = await extractText(file);
      setResume(text, file.name);
      setShowPasteFallback(false);
      setScanned(true);
    } catch (err) {
      clearResume();
      setParseError(err instanceof ParseError ? err.code : "generic");
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
      <span className="hud-label text-xs text-accent/70">{t.upload.label}</span>

      <HudFrame>
        <div
          role="button"
          tabIndex={0}
          aria-label={t.upload.uploadAria}
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
              {t.upload.parsing}
            </p>
          ) : dragging ? (
            <div className="flex flex-col items-center gap-2">
              <Crosshair className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <p className="hud-label text-sm accent-text">{t.upload.dropRelease}</p>
            </div>
          ) : hasResume ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <FileText className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <span className="text-sm text-accent">
                &gt; {resumeFileName}{" "}
                <span className="text-foreground/50">
                  {t.upload.linesIngested(lineCount)}
                </span>
              </span>
              <button
                aria-label={t.upload.remove}
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
                {t.upload.dropTitle}
              </p>
              <p className="text-xs text-foreground/40 mt-1.5">
                {t.upload.dropHint}
              </p>
            </>
          )}
        </div>
      </HudFrame>

      {parseError && (
        <p className="text-xs text-warn">
          <span className="hud-label">{t.upload.parseFault}</span>{" "}
          {parseError === "generic"
            ? t.upload.genericParseError
            : t.upload.parseErrors[parseError]}
        </p>
      )}

      {showPasteFallback && !hasResume && (
        <textarea
          value={pastedText}
          onChange={(e) => handlePaste(e.target.value)}
          placeholder={t.upload.pastePlaceholder}
          rows={8}
          aria-label={t.upload.pasteAria}
          className="hud-panel p-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent resize-y bg-transparent"
        />
      )}
    </div>
  );
}
