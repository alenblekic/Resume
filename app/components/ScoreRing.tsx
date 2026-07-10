"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  label?: string;
}

function scoreColor(score: number): string {
  if (score >= 70) return "#00e5ff";
  if (score >= 45) return "#ffb300";
  return "#ff3b4e";
}

export default function ScoreRing({ score, size = 130, label }: ScoreRingProps) {
  const reduced = useReducedMotion();
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score);
  const [display, setDisplay] = useState(reduced ? score : 0);

  // count-up number
  useEffect(() => {
    if (reduced) return; // display already initialized to score
    const controls = animate(0, score, {
      duration: 1.3,
      delay: 0.3,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, reduced]);

  const center = size / 2;
  const gradId = `ring-grad-${score}-${size}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#00e5ff" />
            </linearGradient>
          </defs>
          {/* tick marks */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const r1 = radius + 6;
            const r2 = radius + 10;
            return (
              <line
                key={i}
                x1={center + r1 * Math.cos(angle)}
                y1={center + r1 * Math.sin(angle)}
                x2={center + r2 * Math.cos(angle)}
                y2={center + r2 * Math.sin(angle)}
                stroke="rgba(236,233,236,0.18)"
                strokeWidth="1"
              />
            );
          })}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(236,233,236,0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduced ? circumference * (1 - score / 100) : circumference }}
            animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="hud-label text-3xl"
            style={{ color, textShadow: `0 0 12px ${color}66` }}
          >
            {display}
          </span>
          <span className="hud-label text-[9px] text-foreground/35">/ 100</span>
        </div>
      </div>
      {label && (
        <span className="hud-label text-[10px] text-foreground/50">{label}</span>
      )}
    </div>
  );
}
