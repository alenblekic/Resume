"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vy: number;
  size: number;
  alpha: number;
  char: string;
}

const CHARS = "01<>/{}[]$#@%&*+=;:";

/**
 * Subtle drifting data-point / digital-rain background on a fixed canvas.
 * Pauses when the tab is hidden; disabled entirely under prefers-reduced-motion.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: 0.15 + Math.random() * 0.5,
        size: 9 + Math.random() * 4,
        alpha: 0.04 + Math.random() * 0.12,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y += p.vy;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(0, 255, 156, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
