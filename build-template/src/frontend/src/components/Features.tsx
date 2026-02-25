import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { FileText, Salad, Bell, Hospital, DollarSign, Languages } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Prescription & Report Analysis',
    desc: 'Extracts dosage, duration, side effects, and explains in simple language.',
    color: '#00d4ff',
    gradient: 'rgba(0,212,255,0.08)',
  },
  {
    icon: Salad,
    title: 'Dietary Guidance',
    desc: 'Personalized food recommendations during medication for optimal recovery.',
    color: '#00fff0',
    gradient: 'rgba(0,255,240,0.08)',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'AI-powered medication alerts and follow-up reminders tailored to your schedule.',
    color: '#7c3aed',
    gradient: 'rgba(124,58,237,0.08)',
  },
  {
    icon: Hospital,
    title: 'Hospital Recommendation',
    desc: 'Suggests nearest reputed hospitals based on diagnosis and specialty required.',
    color: '#0ea5e9',
    gradient: 'rgba(14,165,233,0.08)',
  },
  {
    icon: DollarSign,
    title: 'Medicine Price Comparison',
    desc: 'Compares verified pharmacy platforms to find the best prices for your medications.',
    color: '#a78bfa',
    gradient: 'rgba(167,139,250,0.08)',
  },
  {
    icon: Languages,
    title: 'Multilingual Support',
    desc: 'Marathi, Hindi, Malayalam, English toggle with animated language switch.',
    color: '#00d4ff',
    gradient: 'rgba(0,212,255,0.08)',
  },
];

interface TiltState {
  rotateX: number;
  rotateY: number;
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateX: ((y - centerY) / centerY) * -8,
      rotateY: ((x - centerX) / centerX) * 8,
    });
  };

  return (
    <div
      className={`fade-in-up stagger-${index + 1}`}
      data-stagger
      style={{ perspective: '1000px' }}
    >
      <div
        className="glass p-6 h-full transition-all duration-200"
        style={{
          transform: hovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-6px) scale(1.02)`
            : 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)',
          borderColor: hovered ? feature.color + '60' : 'rgba(0,212,255,0.12)',
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${feature.color}25, inset 0 1px 0 rgba(255,255,255,0.05)`
            : '0 8px 32px rgba(0,0,0,0.3)',
          background: hovered
            ? `linear-gradient(135deg, ${feature.gradient}, rgba(10,22,40,0.7))`
            : 'rgba(10,22,40,0.5)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ rotateX: 0, rotateY: 0 }); }}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{
            background: feature.gradient,
            border: `1px solid ${feature.color}30`,
            boxShadow: hovered ? `0 0 20px ${feature.color}30` : 'none',
          }}
        >
          <Icon
            size={26}
            style={{
              color: feature.color,
              filter: hovered ? `drop-shadow(0 0 8px ${feature.color})` : `drop-shadow(0 0 4px ${feature.color}80)`,
              transition: 'filter 0.3s ease',
            }}
          />
        </div>

        <h3
          className="text-lg font-bold mb-3 transition-all duration-300"
          style={{ color: hovered ? feature.color : '#ffffff' }}
        >
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {feature.desc}
        </p>

        {/* Bottom accent line */}
        <div
          className="mt-5 h-px transition-all duration-300"
          style={{
            background: hovered
              ? `linear-gradient(90deg, ${feature.color}, transparent)`
              : 'rgba(255,255,255,0.05)',
          }}
        />
      </div>
    </div>
  );
}

export default function Features() {
  const sectionRef = useScrollAnimation(0.05) as React.RefObject<HTMLElement>;

  return (
    <section
      id="features"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="section-pad relative"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-medium"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}
          >
            ⚙ Applications
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
            Intelligent Features
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Comprehensive AI-powered tools designed to transform your healthcare experience
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
