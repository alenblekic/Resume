"use client";

import type { PersonaId } from "@/lib/types";
import { useT } from "@/lib/i18n";

/** Language-independent persona identity — labels/status lines live in lib/i18n. */
export const PERSONAS: Record<PersonaId, { color: string; process: string }> = {
  recruiter: { color: "#ff3b4e", process: "RECRUITER.exe" },
  ats: { color: "#00e5ff", process: "ATS.sys" },
  hiringManager: { color: "#ffb300", process: "HIRING_MGR.exe" },
  interviewer: { color: "#a78bfa", process: "INTERVIEWER.bin" },
};

/** Neon line-art HUD glyph for each persona; brightens when active. */
export default function PersonaAvatar({
  persona,
  size = 56,
  active = false,
}: {
  persona: PersonaId;
  size?: number;
  active?: boolean;
}) {
  const t = useT();
  const { color } = PERSONAS[persona];
  const label = t.personas[persona].label;
  const stroke = active ? color : "rgba(236,233,236,0.25)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      role="img"
      aria-label={label}
      fill="none"
      style={{
        filter: active ? `drop-shadow(0 0 8px ${color})` : "none",
        transition: "filter 0.4s ease",
      }}
    >
      {/* hex frame */}
      <path
        d="M28 3 L49 15 L49 41 L28 53 L7 41 L7 15 Z"
        stroke={stroke}
        strokeWidth="1.5"
        style={{ transition: "stroke 0.4s ease" }}
      />
      {persona === "recruiter" && (
        <g stroke={stroke} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }}>
          {/* eye */}
          <path d="M14 28 Q28 16 42 28 Q28 40 14 28 Z" />
          <circle cx="28" cy="28" r="5" />
          <circle cx="28" cy="28" r="1.5" fill={stroke} />
        </g>
      )}
      {persona === "ats" && (
        <g stroke={stroke} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }}>
          {/* barcode scanner */}
          <line x1="17" y1="19" x2="17" y2="37" />
          <line x1="22" y1="19" x2="22" y2="37" strokeWidth="2.5" />
          <line x1="28" y1="19" x2="28" y2="37" />
          <line x1="33" y1="19" x2="33" y2="37" strokeWidth="3" />
          <line x1="39" y1="19" x2="39" y2="37" />
        </g>
      )}
      {persona === "hiringManager" && (
        <g stroke={stroke} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }}>
          {/* clipboard with check */}
          <rect x="18" y="16" width="20" height="26" />
          <rect x="24" y="12" width="8" height="6" />
          <path d="M22 30 L26 34 L34 24" />
        </g>
      )}
      {persona === "interviewer" && (
        <g stroke={stroke} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }}>
          {/* terminal prompt */}
          <rect x="14" y="18" width="28" height="20" />
          <path d="M19 24 L24 28 L19 32" />
          <line x1="27" y1="32" x2="35" y2="32" />
        </g>
      )}
    </svg>
  );
}
