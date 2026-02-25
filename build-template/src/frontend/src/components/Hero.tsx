import { Upload, FileSearch, Play } from 'lucide-react';
import PrescriptionUploader from './PrescriptionUploader';

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.04) 50%, transparent 100%)',
        }}
      />

      {/* Badge */}
      <div
        className="hero-fade-in hero-fade-in-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
        style={{
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: '#00d4ff', boxShadow: '0 0 8px #00d4ff', animation: 'pulseDot 2s ease-in-out infinite' }}
        />
        <span className="text-sm font-medium" style={{ color: '#00d4ff' }}>
          Next-Generation Medical AI Platform
        </span>
      </div>

      {/* Main heading */}
      <h1
        className="hero-fade-in hero-fade-in-delay-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 max-w-5xl"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0f7ff 40%, #00d4ff 70%, #00fff0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.3))',
          }}
        >
          AI-Powered Prescription
        </span>
        <br />
        <span
          style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #00fff0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.4))',
          }}
        >
          & Medical Report Interpreter
        </span>
      </h1>

      {/* Subheading */}
      <p
        className="hero-fade-in hero-fade-in-delay-3 text-lg sm:text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}
      >
        Transforming Complex Medical Language into{' '}
        <span style={{ color: '#00d4ff', fontWeight: 500 }}>Clear, Actionable Insights.</span>
      </p>

      {/* CTA Buttons */}
      <div className="hero-fade-in hero-fade-in-delay-4 flex flex-wrap items-center justify-center gap-4 mb-12">
        <button
          className="btn-glow-primary flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold"
          onClick={() => scrollToSection('#hero')}
        >
          <Upload size={18} />
          Upload Prescription
        </button>

        <button
          className="btn-glow flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold"
          onClick={() => scrollToSection('#features')}
        >
          <FileSearch size={18} />
          Analyze Medical Report
        </button>

        <button
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold transition-all duration-300"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#a78bfa',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(124,58,237,0.5)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.8)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <Play size={18} />
          Try Demo
        </button>
      </div>

      {/* Prescription Uploader */}
      <div className="hero-fade-in hero-fade-in-delay-4 w-full max-w-2xl">
        <PrescriptionUploader />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}
