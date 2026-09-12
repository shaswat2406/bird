'use client';

import { useEffect, useState } from 'react';

const FLOATING_CHIPS = [
  { text: 'O(log N)', top: '15%', left: '8%', delay: '0s', duration: '8s' },
  { text: 'AVL_ROT', top: '28%', right: '10%', delay: '2s', duration: '10s' },
  { text: 'TCP:SYN-ACK', top: '45%', left: '5%', delay: '1s', duration: '9s' },
  { text: 'λ => async', top: '65%', right: '8%', delay: '3s', duration: '11s' },
  { text: 'ACID:SERIALIZABLE', top: '80%', left: '12%', delay: '4s', duration: '12s' },
  { text: '0x7FFF_DEADLOCK', top: '92%', right: '15%', delay: '2.5s', duration: '10.5s' },
];

export default function BackgroundDesign() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none">
      
      {/* 1. Multi-Layer Aurora Glow Orbs */}
      {/* Top Center Amber Light Beam */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[500px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-[140px] animate-pulse-glow" />

      {/* Top Left Neon Cyan/Purple Accent Aura */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] animate-float-slow" />

      {/* Middle Right Deep Orange/Rose Orb */}
      <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-gradient-to-bl from-orange-600/15 via-amber-500/10 to-transparent rounded-full blur-[130px] animate-float-slow-reverse" />

      {/* Bottom Center Emerald Spark Aura */}
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] bg-gradient-to-t from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-[140px]" />

      {/* 2. Cyberpunk Geometric Grid + Dot Matrix Overlay with Radial Mask */}
      <div className="absolute inset-0 bg-cyber-grid opacity-75 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />

      {/* 3. Crosshair Grid Intersection Marks */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 stroke-zinc-400 dark:stroke-white/20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="crosshairs" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Horizontal and Vertical Crosshair Ticks */}
            <path d="M 80 70 L 80 90 M 70 80 L 90 80" strokeWidth="1" />
            <circle cx="80" cy="80" r="1.5" className="fill-orange-500/40" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crosshairs)" />
      </svg>

      {/* 4. Ambient Circuit Constellation Paths */}
      <svg
        className="absolute top-10 left-0 w-full h-full opacity-25 stroke-orange-500/40 dark:stroke-orange-400/30"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M 50 120 L 220 120 L 280 180 L 500 180 M 800 240 L 950 240 L 1020 310 L 1250 310"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="50" cy="120" r="3" className="fill-orange-500 animate-ping" />
        <circle cx="280" cy="180" r="3" className="fill-amber-400" />
        <circle cx="800" cy="240" r="3" className="fill-cyan-400 animate-pulse" />
        <circle cx="1020" cy="310" r="3" className="fill-orange-500" />
      </svg>

      {/* 5. Floating Ambient CSE Code Glyphs */}
      <div className="hidden lg:block">
        {FLOATING_CHIPS.map((chip, index) => (
          <div
            key={index}
            style={{
              top: chip.top,
              left: (chip as any).left,
              right: (chip as any).right,
              animationDelay: chip.delay,
              animationDuration: chip.duration,
            }}
            className="absolute px-3 py-1 rounded-xl glass-panel border border-orange-500/20 dark:border-white/10 text-[10px] font-mono font-bold text-orange-600/70 dark:text-orange-400/60 shadow-lg shadow-orange-500/5 animate-float-badge"
          >
            <span className="text-orange-500 mr-1.5">⚡</span>
            {chip.text}
          </div>
        ))}
      </div>

    </div>
  );
}
