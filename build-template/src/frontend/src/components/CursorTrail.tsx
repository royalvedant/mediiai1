import { useEffect, useRef, useState } from 'react';

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

export default function CursorTrail() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailParticle[]>([]);
  const idRef = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });

      const particle: TrailParticle = {
        id: idRef.current++,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        size: Math.random() * 6 + 3,
      };

      setTrail((prev) => [...prev.slice(-20), particle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fade out trail particles
  useEffect(() => {
    if (isMobile.current) return;
    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.08 }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (isMobile.current) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursor.x - 10,
          top: cursor.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '2px solid #00d4ff',
          boxShadow: '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.4)',
          transition: 'transform 0.1s ease',
          transform: 'translate(0, 0)',
        }}
      />
      {/* Cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursor.x - 3,
          top: cursor.y - 3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#00fff0',
          boxShadow: '0 0 8px #00fff0',
        }}
      />
      {/* Trail particles */}
      {trail.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,212,255,${p.opacity}) 0%, rgba(0,255,240,${p.opacity * 0.5}) 100%)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(0,212,255,${p.opacity * 0.6})`,
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
}
