import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { BarChart2 } from 'lucide-react';

const metrics = [
  { label: 'Precision', value: 94, color: '#00d4ff', desc: 'Correct positive predictions' },
  { label: 'Recall', value: 91, color: '#7c3aed', desc: 'True positive rate' },
  { label: 'F1 Score', value: 92, color: '#00fff0', desc: 'Harmonic mean of precision & recall' },
  { label: 'User Comprehension', value: 87, color: '#f59e0b', desc: 'Patient understanding rate' },
];

function MetricBar({ metric, animate }: { metric: typeof metrics[0]; animate: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setWidth(metric.value), 200);
      return () => clearTimeout(timeout);
    }
  }, [animate, metric.value]);

  return (
    <div className="glass p-6 rounded-2xl transition-all duration-300 group"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = metric.color + '50';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${metric.color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white text-lg">{metric.label}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{metric.desc}</p>
        </div>
        <div
          className="text-3xl font-black"
          style={{ color: metric.color, textShadow: `0 0 15px ${metric.color}60` }}
        >
          {metric.value}%
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${metric.color}, ${metric.color}aa)`,
            boxShadow: `0 0 10px ${metric.color}60, 0 0 20px ${metric.color}30`,
          }}
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between mt-2">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {tick}%
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DatasetsValidation() {
  const sectionRef = useScrollAnimation(0.1) as React.RefObject<HTMLElement>;
  const [animate, setAnimate] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="validation"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-medium"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
          >
            <BarChart2 size={14} />
            Datasets & Validation
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
            Performance Metrics
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Validated on real-world medical datasets with industry-leading accuracy
          </p>
        </div>

        {/* Dashboard panel */}
        <div
          className="glass p-8 rounded-3xl fade-in-up stagger-2"
          style={{ border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 0 40px rgba(0,212,255,0.05)' }}
        >
          {/* Dashboard header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span className="ml-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                MediAI Performance Dashboard
              </span>
            </div>
            <div
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              Live Metrics
            </div>
          </div>

          <div ref={triggerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {metrics.map((metric, i) => (
              <div key={metric.label} className={`fade-in-up stagger-${i + 1}`} data-stagger>
                <MetricBar metric={metric} animate={animate} />
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div
            className="mt-8 pt-6 flex flex-wrap gap-6 justify-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { label: 'Dataset Size', value: '50K+', color: '#00d4ff' },
              { label: 'Languages Tested', value: '4', color: '#7c3aed' },
              { label: 'Drug Database', value: '10K+', color: '#00fff0' },
              { label: 'Validation Rounds', value: '12', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="text-2xl font-black"
                  style={{ color: item.color, textShadow: `0 0 10px ${item.color}50` }}
                >
                  {item.value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
