export default function Scanlines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {/* soft vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 70%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
