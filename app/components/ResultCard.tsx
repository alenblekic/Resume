"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import HudFrame from "./fx/HudFrame";

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  /** Renders an error state instead of children when the persona call failed. */
  failed?: boolean;
  className?: string;
}

export default function ResultCard({
  title,
  icon: Icon,
  children,
  failed = false,
  className = "",
}: ResultCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          y: 0,
          // flicker-on entrance
          opacity: reduced ? 1 : [0, 1, 0.3, 1, 0.6, 1],
          transition: { opacity: { duration: 0.45, times: [0, 0.2, 0.35, 0.5, 0.65, 1] } },
        },
      }}
      className={className}
    >
      <HudFrame className="p-6 h-full">
        <h2 className="hud-label flex items-center gap-2.5 text-xs text-accent/80 mb-5">
          <Icon className="w-4 h-4" strokeWidth={1.5} />
          {title}
        </h2>
        {failed ? (
          <p className="flex items-center gap-2 text-xs text-warn">
            <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span className="hud-label">Data stream lost</span> — re-run analysis.
          </p>
        ) : (
          children
        )}
      </HudFrame>
    </motion.div>
  );
}
