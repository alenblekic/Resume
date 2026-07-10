"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Terminal-style character-by-character typing with a block cursor.
 * Shows the full text immediately under prefers-reduced-motion.
 */
export default function TypeWriter({
  text,
  speed = 22,
  delay = 0,
  cursor = true,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduced) {
      // count already initialized to text.length; remounts re-evaluate it
      onDone?.();
      return;
    }
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setCount(0);
      interval = setInterval(() => {
        setCount((c) => {
          if (c + 1 >= text.length) {
            clearInterval(interval);
            onDone?.();
            return text.length;
          }
          return c + 1;
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, delay, reduced]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {cursor && (
        <span
          aria-hidden
          className={`inline-block w-[0.55em] h-[1.05em] align-text-bottom bg-accent ml-0.5 ${
            done ? "hud-blink" : ""
          }`}
        />
      )}
    </span>
  );
}
