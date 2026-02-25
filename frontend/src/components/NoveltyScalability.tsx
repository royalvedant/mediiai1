import { useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Building2, ShoppingBag, Smartphone, FileCode, Video, Activity } from 'lucide-react';

const integrations = [
  { icon: Building2, label: 'Hospital Integration', color: '#00d4ff' },
  { icon: ShoppingBag, label: 'Pharmacy Software', color: '#7c3aed' },
  { icon: Smartphone, label: 'Mobile App', color: '#00fff0' },
  { icon: FileCode, label: 'EHR Systems', color: '#f59e0b' },
  { icon: Video, label: 'Telemedicine', color: '#0ea5e9' },
];

function OrbitNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(500, window.innerWidth - 40);
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2;
    const orbitR = size * 0.35;

    const nodeColors = ['#00d4ff', '#7c3aed', '#00fff0', '#f59e0b', '#0ea5e9'];
    const nodeLabels = ['Hospital', 'Pharmacy', 'Mobile', 'EHR', 'Telemedicine'];

    let time = 0;
    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      time += 0.005;
      ctx.clearRect(0, 0, size, size);

      // Outer glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbitR * 1.5);
      bgGrad.addColorStop(0, 'rgba(0,212,255,0.04)');
      bgGrad.addColorStop(0.5, 'rgba(124,58,237,0.03)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Orbit ring
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute node positions
      const nodePositions = integrations.map((_, i) => {
        const angle = (i / integrations.length) * Math.PI * 2 + time;
        return {
          x: cx + Math.cos(angle) * orbitR,
          y: cy + Math.sin(angle) * orbitR,
          color: nodeColors[i],
          label: nodeLabels[i],
        };
      });

      // Draw connections from center to nodes
      nodePositions.forEach((node) => {
        const grad = ctx.createLinearGradient(cx, cy, node.x, node.y);
        grad.addColorStop(0, 'rgba(0,212,255,0.5)');
        grad.addColorStop(1, node.color + '60');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();

        // Traveling particle on connection
        const particleT = ((time * 0.5) % 1);
        const px = cx + (node.x - cx) * particleT;
        const py = cy + (node.y - cy) * particleT;
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodePositions.forEach((node) => {
        // Glow
        const nodeGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
        nodeGrad.addColorStop(0, node.color + 'aa');
        nodeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = 'rgba(10,22,40,0.9)';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Center hub
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      hubGrad.addColorStop(0, 'rgba(0,212,255,0.9)');
      hubGrad.addColorStop(0.5, 'rgba(124,58,237,0.7)');
      hubGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = hubGrad;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${size * 0.028}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MediAI', cx, cy);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.2))' }} />;
}

export default function NoveltyScalability() {
  const sectionRef = useScrollAnimation(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      id="scalability"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-medium"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
          >
            🚀 Novelty & Scalability
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #e0f7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ecosystem Integration
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            MediAI seamlessly integrates with the entire healthcare ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Orbit visualization */}
          <div className="flex justify-center fade-in-up">
            <OrbitNetwork />
          </div>

          {/* Integration list */}
          <div className="fade-in-up stagger-2">
            <h3
              className="text-2xl font-black mb-8"
              style={{ color: '#ffffff' }}
            >
              Connected Healthcare Ecosystem
            </h3>
            <div className="space-y-4">
              {integrations.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`glass flex items-center gap-4 p-4 rounded-xl transition-all duration-300 fade-in-up stagger-${i + 2}`}
                    data-stagger
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = item.color + '60';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${item.color}20`;
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '';
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                    >
                      <Icon size={22} style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color})` }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{item.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Seamless API integration
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: item.color, boxShadow: `0 0 6px ${item.color}`, animation: 'pulseDot 2s ease-in-out infinite' }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '99.9%', label: 'Uptime', color: '#00d4ff' },
                { value: '<50ms', label: 'Response', color: '#7c3aed' },
                { value: 'HIPAA', label: 'Compliant', color: '#00fff0' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass p-4 text-center rounded-xl"
                  style={{ border: `1px solid ${stat.color}20` }}
                >
                  <div
                    className="text-lg font-black"
                    style={{ color: stat.color, textShadow: `0 0 8px ${stat.color}50` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
