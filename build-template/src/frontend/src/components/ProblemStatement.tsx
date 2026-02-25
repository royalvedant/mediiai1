import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { AlertTriangle, BookOpen, Pill, Brain } from 'lucide-react';

const problems = [
  {
    icon: BookOpen,
    title: 'Low Health Literacy',
    desc: 'Patients struggle to understand complex medical terminology and prescription instructions.',
    color: '#00d4ff',
  },
  {
    icon: Pill,
    title: 'Medication Errors',
    desc: 'Misinterpretation of dosage and drug interactions leads to dangerous outcomes.',
    color: '#7c3aed',
  },
  {
    icon: Brain,
    title: 'High Anxiety',
    desc: 'Unclear diagnoses and reports cause unnecessary stress and delayed treatment.',
    color: '#00fff0',
  },
];

export default function ProblemStatement() {
  const sectionRef = useScrollAnimation(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      id="problem"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          >
            <AlertTriangle size={14} />
            The Problem
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
            A Critical Communication Gap
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            In the current healthcare landscape, especially in India, there is a critical communication gap
            between clinical documentation and patient comprehension.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className={`glass glass-hover p-6 fade-in-up stagger-${i + 1}`}
                data-stagger
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `rgba(${problem.color === '#00d4ff' ? '0,212,255' : problem.color === '#7c3aed' ? '124,58,237' : '0,255,240'},0.1)`,
                      border: `1px solid ${problem.color}30`,
                    }}
                  >
                    <Icon size={22} style={{ color: problem.color, filter: `drop-shadow(0 0 6px ${problem.color})` }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="pulse-dot" style={{ background: problem.color, boxShadow: `0 0 8px ${problem.color}` }} />
                      <h3 className="font-bold text-white">{problem.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {problem.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stat highlight */}
        <div className="flex justify-center fade-in-up stagger-4">
          <div
            className="glass p-8 text-center max-w-2xl w-full relative overflow-hidden"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {/* Red pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="absolute rounded-full"
                style={{
                  width: 200,
                  height: 200,
                  border: '1px solid rgba(239,68,68,0.2)',
                  animation: 'glowRing 3s ease-out infinite',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 200,
                  height: 200,
                  border: '1px solid rgba(239,68,68,0.15)',
                  animation: 'glowRing 3s ease-out infinite 1s',
                }}
              />
            </div>

            <div className="relative z-10">
              <p
                className="text-4xl sm:text-5xl font-black mb-2"
                style={{ color: '#f87171', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}
              >
                1.5 Million
              </p>
              <p className="text-lg font-semibold text-white mb-2">
                Preventable Adverse Events Annually
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Due to medication misunderstanding and poor health literacy in India alone
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
