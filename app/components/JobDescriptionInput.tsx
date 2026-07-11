"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function JobDescriptionInput() {
  const { jobDescription, setJobDescription } = useAppStore();
  const t = useT();

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="job-description"
        className="hud-label text-xs text-accent/70"
      >
        {t.jd.label} <span className="text-accent">*</span>
      </label>
      <textarea
        id="job-description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder={t.jd.placeholder}
        rows={8}
        className="hud-panel p-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent focus:shadow-[0_0_20px_rgba(255,59,78,0.15)] resize-y bg-transparent transition-shadow"
      />
      <p className="text-xs text-foreground/35">{t.jd.hint}</p>
    </div>
  );
}
