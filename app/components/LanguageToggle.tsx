"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { Lang } from "@/lib/types";

const LANGS: Lang[] = ["en", "sv"];

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  // store persistence is skipHydration — restore the saved language after mount
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  // keep <html lang> in sync (layout is a Server Component with a static default)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div
      role="group"
      aria-label="Language / Språk"
      className="hud-label flex border border-foreground/20 text-[10px]"
    >
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`cursor-pointer px-3 py-1.5 transition-colors ${
            language === lang
              ? "bg-accent/15 text-accent border-accent"
              : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
