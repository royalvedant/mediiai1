import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Zap, Globe, Shield } from 'lucide-react';

const stats = [
  { icon: Zap, value: '98%', label: 'Extraction Accuracy', color: '#00d4ff' },
  { icon: Globe, value: '4+', label: 'Regional Languages', color: '#7c3aed' },
  { icon: Shield, value: '∞', label: 'Drug Interaction Alerts', color: '#00fff0' },
];

function AnimatedBrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const cx = 150, cy = 150, r = 100;
    const nodeCount = 20;
    const nodes: { x: number; y: number; vx: number; vy: number; phase: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      time += 0.02;
      ctx.clearRect(0, 0, 300, 300);

      // Outer glow ring
      const grad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.2);
      grad.addColorStop(0, 'rgba(0,212,255,0.05)');
      grad.addColorStop(0.5, 'rgba(124,58,237,0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Rotating outer ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      ctx.strokeStyle = 'rgba(0,212,255,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.5);
      ctx.strokeStyle = 'rgba(124,58,237,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        const dx = node.x - cx, dy = node.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r * 0.9) {
          node.vx -= dx * 0.001;
          node.vy -= dy * 0.001;
        }
        if (dist < 20) {
          node.vx += dx * 0.01;
          node.vy += dy * 0.01;
        }

        // Draw connections
        nodes.forEach((other, j) => {
          if (j <= i) return;
          const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          if (d < 80) {
            const alpha = (1 - d / 80) * 0.4;
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw node
        const pulse = 0.5 + Math.sin(time * 2 + node.phase) * 0.3;
        const nodeColor = i % 3 === 0 ? `rgba(0,212,255,${pulse})` : i % 3 === 1 ? `rgba(124,58,237,${pulse})` : `rgba(0,255,240,${pulse})`;
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Center orb
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25);
      centerGrad.addColorStop(0, 'rgba(0,212,255,0.9)');
      centerGrad.addColorStop(0.5, 'rgba(124,58,237,0.6)');
      centerGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGrad;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 300, height: 300, filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.3))' }}
    />
  );
}

export default function Motivation() {
  const sectionRef = useScrollAnimation(0.1) as React.RefObject<HTMLElement>;
  const [counted, setCounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [counted]);

  return (
    <section
      id="motivation"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Brain hologram */}
          <div className="flex flex-col items-center fade-in-up">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)',
                  transform: 'scale(1.5)',
                }}
              />
              <AnimatedBrain />
            </div>
            <p
              className="mt-4 text-sm font-medium tracking-widest uppercase"
              style={{ color: 'rgba(0,212,255,0.6)' }}
            >
              Neural AI Engine
            </p>
          </div>

          {/* Right: Content */}
          <div className="fade-in-up stagger-2">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
            >
              Our Motivation
            </div>

            <h2
              className="text-3xl sm:text-4xl font-black mb-6 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #e0f7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Bridging the Gap Between Doctors & Patients
            </h2>

            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Our AI bridges the gap between doctors and patients using{' '}
              <span style={{ color: '#00d4ff' }}>intelligent prescription analysis</span>,{' '}
              <span style={{ color: '#7c3aed' }}>multilingual explanations</span>, and{' '}
              <span style={{ color: '#00fff0' }}>verified medical data</span>.
            </p>

            {/* Stat counters */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`glass p-5 text-center transition-all duration-300 fade-in-up stagger-${i + 3}`}
                    data-stagger
                    style={{ animationDelay: `${i * 0.15}s` }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = stat.color + '60';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${stat.color}30`;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '';
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                      (e.currentTarget as HTMLElement).style.transform = '';
                    }}
                  >
                    <Icon size={24} style={{ color: stat.color, margin: '0 auto 8px', filter: `drop-shadow(0 0 6px ${stat.color})` }} />
                    <div
                      className="text-2xl font-black mb-1"
                      style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}60` }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
