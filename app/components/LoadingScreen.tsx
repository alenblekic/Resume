"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PersonaId } from "@/lib/types";
import { useT } from "@/lib/i18n";
import PersonaAvatar, { PERSONAS } from "./PersonaAvatar";
import TypeWriter from "./fx/TypeWriter";

const PERSONA_IDS: PersonaId[] = ["recruiter", "ats", "hiringManager", "interviewer"];

/** Node positions in the 640x460 SVG scene (diamond around center doc). */
const NODE_POS: Record<PersonaId, { x: number; y: number }> = {
  recruiter: { x: 90, y: 110 },
  ats: { x: 550, y: 110 },
  hiringManager: { x: 90, y: 350 },
  interviewer: { x: 550, y: 350 },
};

const DOC = { x: 250, y: 130, w: 140, h: 200 };
const DOC_CENTER = { x: DOC.x + DOC.w / 2, y: DOC.y + DOC.h / 2 };

export default function LoadingScreen() {
  const t = useT();
  const reduced = useReducedMotion();
  const [activeCount, setActiveCount] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  // activate persona nodes one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount((c) => Math.min(c + 1, PERSONA_IDS.length));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // rotate terminal log lines
  const logLines = [
    ...PERSONA_IDS.map((id) => `> ${t.personas[id].statusLine}`),
    ...t.loading.extras,
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((i) => (i + 1) % logLines.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [logLines.length]);

  const activeIds = PERSONA_IDS.slice(0, activeCount);

  // reduced-motion fallback: static nodes + status text
  if (reduced) {
    return (
      <motion.div
        className="flex flex-col items-center gap-8 mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex gap-8 flex-wrap justify-center">
          {PERSONA_IDS.map((id) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <PersonaAvatar persona={id} active={activeIds.includes(id)} />
              <span className="hud-label text-[10px] text-foreground/60">
                {t.personas[id].label}
              </span>
            </div>
          ))}
        </div>
        <p className="hud-label text-sm text-accent">{logLines[logIndex]}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="hud-label text-[10px] text-accent/50">{t.loading.header}</p>

      <svg
        viewBox="0 0 640 460"
        className="w-full max-w-[640px]"
        role="img"
        aria-label={t.loading.aria}
      >
        <defs>
          <linearGradient id="laser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff3b4e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* connection lines doc -> nodes */}
        {PERSONA_IDS.map((id) => {
          const pos = NODE_POS[id];
          const isActive = activeIds.includes(id);
          return (
            <line
              key={`line-${id}`}
              x1={DOC_CENTER.x}
              y1={DOC_CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke={isActive ? PERSONAS[id].color : "rgba(236,233,236,0.08)"}
              strokeWidth="1"
              strokeDasharray="4 6"
              style={{ transition: "stroke 0.5s ease" }}
            />
          );
        })}

        {/* particles streaming doc -> active nodes */}
        {activeIds.map((id) => {
          const pos = NODE_POS[id];
          return [0, 1, 2].map((n) => (
            <motion.circle
              key={`p-${id}-${n}`}
              r="2.5"
              fill={PERSONAS[id].color}
              initial={{ cx: DOC_CENTER.x, cy: DOC_CENTER.y, opacity: 0 }}
              animate={{
                cx: [DOC_CENTER.x, pos.x],
                cy: [DOC_CENTER.y, pos.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.6,
                delay: n * 0.55,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ));
        })}

        {/* wireframe document */}
        <g>
          <rect
            x={DOC.x}
            y={DOC.y}
            width={DOC.w}
            height={DOC.h}
            fill="rgba(255,59,78,0.03)"
            stroke="rgba(255,59,78,0.5)"
            strokeWidth="1.5"
          />
          {/* folded corner */}
          <path
            d={`M ${DOC.x + DOC.w - 22} ${DOC.y} L ${DOC.x + DOC.w} ${DOC.y + 22}`}
            stroke="rgba(255,59,78,0.5)"
            strokeWidth="1.5"
          />
          {/* text line bars */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={DOC.x + 16}
              y={DOC.y + 24 + i * 22}
              width={i === 0 ? 70 : i % 3 === 0 ? 85 : 108}
              height="5"
              fill="rgba(236,233,236,0.18)"
            />
          ))}
          {/* laser sweep */}
          <motion.rect
            x={DOC.x - 12}
            width={DOC.w + 24}
            height="26"
            fill="url(#laser)"
            initial={{ y: DOC.y - 26 }}
            animate={{ y: DOC.y + DOC.h + 4 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          {/* laser edge line */}
          <motion.line
            x1={DOC.x - 12}
            x2={DOC.x + DOC.w + 12}
            stroke="#ff3b4e"
            strokeWidth="1.5"
            initial={{ y1: DOC.y - 13, y2: DOC.y - 13 }}
            animate={{ y1: DOC.y + DOC.h + 17, y2: DOC.y + DOC.h + 17 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{ filter: "drop-shadow(0 0 6px #ff3b4e)" }}
          />
        </g>

        {/* persona nodes */}
        {PERSONA_IDS.map((id, i) => {
          const pos = NODE_POS[id];
          const isActive = activeIds.includes(id);
          return (
            <g key={`node-${id}`}>
              {/* pulse ring on activation */}
              {isActive && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  fill="none"
                  stroke={PERSONAS[id].color}
                  strokeWidth="1.5"
                  initial={{ r: 30, opacity: 0.8 }}
                  animate={{ r: 52, opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <foreignObject x={pos.x - 28} y={pos.y - 28} width="56" height="56">
                  <PersonaAvatar persona={id} active={isActive} />
                </foreignObject>
                <text
                  x={pos.x}
                  y={pos.y + 46}
                  textAnchor="middle"
                  fill={isActive ? PERSONAS[id].color : "rgba(236,233,236,0.35)"}
                  fontSize="11"
                  className="hud-label"
                  style={{ transition: "fill 0.4s ease" }}
                >
                  {PERSONAS[id].process}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* terminal log */}
      <div className="hud-panel w-full max-w-md px-4 py-3 min-h-[3.2em]">
        <AnimatePresence mode="wait">
          <motion.div
            key={logIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <TypeWriter
              text={logLines[logIndex]}
              speed={16}
              className="text-xs text-accent"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
