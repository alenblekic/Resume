export default function Scanlines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {/* scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(255,59,78,0.025) 3px, rgba(0,0,0,0) 4px)",
        }}
      />
      {/* CRT vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
