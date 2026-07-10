"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * HUD panel with corner brackets and a mouse-tracking radial glow.
 */
export default function HudFrame({
  children,
  className = "",
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={glow ? handleMouseMove : undefined}
      className={`hud-panel ${glow ? "hud-panel-glow" : ""} ${className}`}
    >
      <span aria-hidden className="hud-corner hud-corner-tl" />
      <span aria-hidden className="hud-corner hud-corner-tr" />
      <span aria-hidden className="hud-corner hud-corner-bl" />
      <span aria-hidden className="hud-corner hud-corner-br" />
      {children}
    </div>
  );
}
