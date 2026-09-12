'use client';

import { useEffect, useState } from 'react';

export default function CursorSpotlight() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isPointerInside, setIsPointerInside] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handlePointerMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        if (!isPointerInside) setIsPointerInside(true);
      });
    };

    const handlePointerLeave = () => {
      setIsPointerInside(false);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.body.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.body.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPointerInside]);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 transition-opacity duration-500 overflow-hidden"
      style={{ opacity: isPointerInside ? 1 : 0 }}
    >
      {/* Primary Radiant Ambient Spotlight */}
      <div
        className="absolute w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(245, 158, 11, 0.06) 40%, transparent 75%)',
        }}
      />

      {/* Secondary Focused Micro-Core Glow */}
      <div
        className="absolute w-[220px] h-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px] transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
