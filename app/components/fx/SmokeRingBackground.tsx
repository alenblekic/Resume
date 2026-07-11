"use client";

import { useReducedMotion } from "framer-motion";
import SmokeRing from "@/components/ui/smoke-ring";

/**
 * Ambient WebGL smoke-ring backdrop — slow violet/cyan drift behind the HUD.
 * Static-background fallback when the user prefers reduced motion.
 */
export default function SmokeRingBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    >
      <SmokeRing
        colorBack="#000000"
        colors={["#a78bfa", "#00e5ff"]}
        noiseScale={1.4}
        noiseIterations={6}
        radius={0.45}
        thickness={0.5}
        innerShape={0.6}
        speed={0.35}
        scale={1}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
