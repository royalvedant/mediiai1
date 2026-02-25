import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ScanLine, Brain, Database, AlertCircle, MessageSquare } from 'lucide-react';

const steps = [
  { icon: ScanLine, label: 'OCR', desc: 'Text Extraction', color: '#00d4ff' },
  { icon: Brain, label: 'Medical NLP', desc: 'Language Processing', color: '#7c3aed' },
  { icon: Database, label: 'RAG Pipeline', desc: 'Knowledge Retrieval', color: '#00fff0' },
  { icon: AlertCircle, label: 'Drug Interaction', desc: 'Safety Check', color: '#f59e0b' },
  { icon: MessageSquare, label: 'Simplified Output', desc: 'Patient Explanation', color: '#00d4ff' },
];

function TravelingParticle({ delay }: { delay: number }) {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
      style={{
        background: '#00d4ff',
        boxShadow: '0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.5)',
        animation: `travelRight 2.5s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function ProposedMethod() {
  const sectionRef = useScrollAnimation(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      id="method"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-medium"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
          >
            🧠 Proposed Method
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
            AI System Flow
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            From raw prescription to clear patient understanding in milliseconds
          </p>
        </div>

        {/* Flow diagram */}
        <div className="fade-in-up stagger-2">
          {/* Desktop horizontal flow */}
          <div className="hidden md:flex items-center justify-between gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center flex-1">
                  {/* Node */}
                  <div
                    className="glass flex-shrink-0 flex flex-col items-center p-5 rounded-2xl transition-all duration-300 group"
                    style={{
                      minWidth: 120,
                      border: `1px solid ${step.color}30`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = step.color + '80';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${step.color}30`;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = step.color + '30';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon size={22} style={{ color: step.color, filter: `drop-shadow(0 0 6px ${step.color})` }} />
                    </div>
                    <span className="text-sm font-bold text-white text-center">{step.label}</span>
                    <span className="text-xs mt-1 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {step.desc}
                    </span>
                    <div
                      className="mt-2 text-xs font-bold"
                      style={{ color: step.color, textShadow: `0 0 8px ${step.color}` }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Connector */}
                  {i < steps.length - 1 && (
                    <div className="flex-1 relative h-px mx-2" style={{ minWidth: 20 }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, rgba(0,212,255,0.4), rgba(124,58,237,0.4))',
                          boxShadow: '0 0 6px rgba(0,212,255,0.3)',
                        }}
                      />
                      <TravelingParticle delay={i * 0.5} />
                      <TravelingParticle delay={i * 0.5 + 1.25} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile vertical flow */}
          <div className="md:hidden flex flex-col items-center gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center w-full max-w-xs">
                  <div
                    className="glass w-full flex items-center gap-4 p-4 rounded-2xl"
                    style={{ border: `1px solid ${step.color}30` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon size={22} style={{ color: step.color, filter: `drop-shadow(0 0 6px ${step.color})` }} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{step.label}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</div>
                    </div>
                    <div
                      className="ml-auto text-sm font-black"
                      style={{ color: step.color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-px h-8 my-1"
                      style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.5), rgba(124,58,237,0.5))' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
