/** Ambient particles + neural scan — pointer-events none, respects reduced motion via CSS. */
export function UniverseBackdrop() {
  const particles = Array.from({ length: 18 }, (_, i) => i)

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.06),_transparent_50%)]" />
      {particles.map((i) => (
        <span
          key={i}
          className="animate-savvy-particle absolute h-1 w-1 rounded-full bg-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
          style={{
            left: `${(i * 17 + 11) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
      <div className="absolute left-[8%] top-[12%] h-[45vh] w-px bg-gradient-to-b from-transparent via-sky-400/25 to-transparent animate-savvy-neural-scan" />
      <div className="absolute right-[12%] top-[20%] h-[38vh] w-px bg-gradient-to-b from-transparent via-violet-400/20 to-transparent animate-savvy-neural-scan [animation-delay:1.2s]" />
    </div>
  )
}
