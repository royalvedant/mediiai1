import { useState } from 'react';
import ThreeJsBackground from './components/ThreeJsBackground';
import CursorTrail from './components/CursorTrail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import Motivation from './components/Motivation';
import Features from './components/Features';
import ProposedMethod from './components/ProposedMethod';
import DatasetsValidation from './components/DatasetsValidation';
import NoveltyScalability from './components/NoveltyScalability';
import AIChatAssistant from './components/AIChatAssistant';
import Dashboard from './components/Dashboard';
import MedicineComparison from './components/MedicineComparison';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import ProfileSetup from './components/ProfileSetup';
import EmergencyCTA from './components/EmergencyCTA';
import EmergencyTrackingOverlay from './components/EmergencyTrackingOverlay';

export default function App() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeEmergencyCase, setActiveEmergencyCase] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('light-mode');
        document.body.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
        document.body.classList.remove('light-mode');
      }
      return next;
    });
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: isLightMode
          ? 'linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 50%, #e8f0ff 100%)'
          : 'linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1a 100%)',
        color: isLightMode ? '#0a1628' : '#f0f9ff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Three.js animated background */}
      <ThreeJsBackground isLightMode={isLightMode} />

      {/* Custom cursor trail */}
      <CursorTrail />

      {/* Sticky navigation */}
      <Navbar isLightMode={isLightMode} onToggleTheme={toggleTheme} />

      {/* Profile setup modal — overlays entire app when needed */}
      <ProfileSetup />

      {/* Emergency tracking overlay */}
      {activeEmergencyCase && (
        <EmergencyTrackingOverlay
          caseId={activeEmergencyCase}
          onClose={() => setActiveEmergencyCase(null)}
        />
      )}

      {/* Main content */}
      <main className="relative z-10">
        <Hero />

        {/* Emergency CTA Section directly below Hero */}
        <section className="py-12 px-4 relative z-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-red-500/10 border border-red-500/30 text-red-500">
              🚨 24/7 Rapid Response
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-8" style={{ textShadow: isLightMode ? 'none' : '0 0 20px rgba(239,68,68,0.3)' }}>
              Need Immediate Medical Help?
            </h2>
            <EmergencyCTA onRequested={(caseId) => setActiveEmergencyCase(caseId)} />
            <p className="mt-6 text-sm opacity-60 max-w-sm mx-auto">
              Automatically dispatches the nearest ambulance to your current location using GPS mapping.
            </p>
          </div>
        </section>

        <ProblemStatement />
        <Motivation />
        <Features />

        {/* Tools Section */}
        <section
          id="tools"
          className="py-20 px-4"
          style={{
            background: isLightMode
              ? 'rgba(232,244,255,0.4)'
              : 'rgba(0,212,255,0.02)',
            borderTop: '1px solid rgba(0,212,255,0.08)',
            borderBottom: '1px solid rgba(0,212,255,0.08)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section heading */}
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  color: '#00d4ff',
                }}
              >
                ⚡ Interactive Tools
              </div>
              <h2
                className="text-3xl sm:text-4xl font-black mb-4"
                style={{
                  color: isLightMode ? '#0a1628' : '#f0f9ff',
                  textShadow: isLightMode ? 'none' : '0 0 30px rgba(0,212,255,0.2)',
                }}
              >
                MediAI{' '}
                <span
                  style={{
                    color: '#00d4ff',
                    textShadow: '0 0 20px rgba(0,212,255,0.6)',
                  }}
                >
                  Tools
                </span>
              </h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: isLightMode ? 'rgba(10,22,40,0.6)' : 'rgba(255,255,255,0.5)' }}
              >
                Powerful AI-driven utilities to help you manage your medications safely and effectively.
              </p>
            </div>

            {/* Tool components */}
            <div className="space-y-8">
              <MedicineComparison />
              <DrugInteractionChecker />
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section
          id="dashboard"
          className="py-20 px-4"
          style={{
            background: isLightMode
              ? 'rgba(232,244,255,0.3)'
              : 'rgba(124,58,237,0.02)',
            borderBottom: '1px solid rgba(0,212,255,0.08)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section heading */}
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  color: '#a78bfa',
                }}
              >
                🔐 Personal Health Records
              </div>
              <h2
                className="text-3xl sm:text-4xl font-black mb-4"
                style={{
                  color: isLightMode ? '#0a1628' : '#f0f9ff',
                  textShadow: isLightMode ? 'none' : '0 0 30px rgba(124,58,237,0.2)',
                }}
              >
                Your{' '}
                <span
                  style={{
                    color: '#a78bfa',
                    textShadow: '0 0 20px rgba(124,58,237,0.6)',
                  }}
                >
                  Dashboard
                </span>
              </h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: isLightMode ? 'rgba(10,22,40,0.6)' : 'rgba(255,255,255,0.5)' }}
              >
                Access your prescriptions, reminders, drug interaction history, and diet plans — all in one place.
              </p>
            </div>

            {/* Dashboard component */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: isLightMode
                  ? 'rgba(255,255,255,0.6)'
                  : 'rgba(10,22,40,0.6)',
                border: '1px solid rgba(124,58,237,0.2)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(124,58,237,0.1)',
              }}
            >
              <Dashboard />
            </div>
          </div>
        </section>

        <ProposedMethod />
        <DatasetsValidation />
        <NoveltyScalability />
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-10 px-4 text-center"
        style={{
          borderTop: '1px solid rgba(0,212,255,0.1)',
          background: isLightMode
            ? 'rgba(232,244,255,0.6)'
            : 'rgba(2,8,23,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center justify-center gap-2 mb-3"
            style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.5)' }}
          >
            <span className="text-lg font-black tracking-wider">MediAI</span>
          </div>
          <p
            className="text-sm mb-4"
            style={{ color: isLightMode ? 'rgba(10,22,40,0.5)' : 'rgba(255,255,255,0.35)' }}
          >
            AI-Powered Prescription & Medical Report Interpreter
          </p>
          <p
            className="text-xs"
            style={{ color: isLightMode ? 'rgba(10,22,40,0.4)' : 'rgba(255,255,255,0.25)' }}
          >
            © {new Date().getFullYear()} MediAI. Built with{' '}
            <span style={{ color: '#f87171' }}>♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'mediAI')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00d4ff', textDecoration: 'none' }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.textDecoration = 'none')
              }
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Floating AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
}
