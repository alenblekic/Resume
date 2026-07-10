"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * HUD title with periodic RGB-split glitch bursts.
 * Renders plain text under prefers-reduced-motion.
 */
export default function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => {
          setGlitching(false);
          schedule();
        }, 180);
      }, 2500 + Math.random() * 3500);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reduced]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 text-cyan opacity-80"
            style={{
              transform: "translate(-3px, -1px)",
              clipPath: "polygon(0 15%, 100% 15%, 100% 40%, 0 40%)",
            }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 text-warn opacity-80"
            style={{
              transform: "translate(3px, 1px)",
              clipPath: "polygon(0 60%, 100% 60%, 100% 85%, 0 85%)",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
