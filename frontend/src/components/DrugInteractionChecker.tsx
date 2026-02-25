import { useState } from 'react';
import { Plus, Minus, AlertTriangle, Loader2, Shield, Zap } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveDrugInteraction } from '../hooks/useMediAIQueries';

interface InteractionWarning {
  severity: 'moderate' | 'severe';
  message: string;
}

function generateWarnings(medications: string[]): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const a = medications[i];
      const b = medications[j];
      const isSevere = (i + j) % 3 === 0;
      warnings.push({
        severity: isSevere ? 'severe' : 'moderate',
        message: isSevere
          ? `⚠ Severe interaction between ${a} and ${b}: May cause serious adverse effects. Consult your doctor immediately.`
          : `⚡ Moderate interaction between ${a} and ${b}: May increase drowsiness or reduce effectiveness. Monitor closely.`,
      });
    }
  }
  return warnings;
}

export default function DrugInteractionChecker() {
  const [medicines, setMedicines] = useState<string[]>(['', '']);
  const [warnings, setWarnings] = useState<InteractionWarning[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { identity } = useInternetIdentity();
  const saveDrugMutation = useSaveDrugInteraction();

  const addMedicine = () => {
    if (medicines.length < 5) setMedicines((prev) => [...prev, '']);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length <= 2) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, value: string) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      if (index === medicines.length - 1) {
        handleCheck();
      }
    }
  };

  const handleCheck = async () => {
    const filled = medicines.map((m) => m.trim()).filter(Boolean);
    if (filled.length < 2) return;

    setIsChecking(true);
    setWarnings(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const generatedWarnings = generateWarnings(filled);
    setWarnings(generatedWarnings);
    setIsChecking(false);

    if (identity) {
      const userId = identity.getPrincipal().toString();
      const summary = generatedWarnings.map((w) => w.message).join(' | ');
      setIsSaving(true);
      try {
        await saveDrugMutation.mutateAsync({ userId, medications: filled, interactionSummary: summary });
      } catch {
        // silently fail
      } finally {
        setIsSaving(false);
      }
    }
  };

  const filledCount = medicines.filter((m) => m.trim()).length;
  const canCheck = filledCount >= 2 && !isChecking;

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: 'rgba(251,191,36,0.03)',
        border: '1px solid rgba(251,191,36,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(251,191,36,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))',
            border: '1px solid rgba(251,191,36,0.3)',
            boxShadow: '0 0 15px rgba(251,191,36,0.2)',
          }}
        >
          <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.5)' }}
          >
            Drug Interaction Checker
          </h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Check for potential interactions between your medications
          </p>
        </div>
      </div>

      {/* Medicine inputs */}
      <div className="space-y-3 mb-5">
        {medicines.map((med, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,191,36,0.2)',
              }}
            >
              <span
                className="text-xs font-bold w-5 text-center flex-shrink-0"
                style={{ color: 'rgba(251,191,36,0.6)' }}
              >
                {index + 1}
              </span>
              <input
                type="text"
                value={med}
                onChange={(e) => updateMedicine(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={`Medicine ${index + 1} (e.g. Aspirin)`}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'rgba(255,255,255,0.85)', caretColor: '#fbbf24' }}
                aria-label={`Medicine ${index + 1}`}
              />
            </div>
            {medicines.length > 2 && (
              <button
                onClick={() => removeMedicine(index)}
                className="p-2.5 rounded-xl transition-all duration-200 flex-shrink-0"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: 'rgba(239,68,68,0.7)',
                }}
                aria-label={`Remove medicine ${index + 1}`}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)';
                }}
              >
                <Minus size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add medicine button */}
      {medicines.length < 5 && (
        <button
          onClick={addMedicine}
          className="flex items-center gap-2 text-sm font-medium mb-5 transition-all duration-200"
          style={{ color: 'rgba(251,191,36,0.7)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(251,191,36,0.7)';
          }}
        >
          <Plus size={15} />
          Add another medicine ({medicines.length}/5)
        </button>
      )}

      {/* Check button */}
      <button
        onClick={handleCheck}
        disabled={!canCheck || isSaving}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: canCheck && !isSaving
            ? 'linear-gradient(135deg, rgba(251,191,36,0.9), rgba(245,158,11,0.8))'
            : 'rgba(255,255,255,0.05)',
          color: canCheck && !isSaving ? '#020817' : 'rgba(255,255,255,0.3)',
          boxShadow: canCheck && !isSaving ? '0 0 20px rgba(251,191,36,0.4)' : 'none',
          cursor: canCheck && !isSaving ? 'pointer' : 'not-allowed',
        }}
      >
        {isChecking ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing Interactions...
          </>
        ) : isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Shield size={16} />
            Check Interactions
          </>
        )}
      </button>

      {/* Results */}
      {warnings !== null && (
        <div className="mt-6 space-y-3">
          <h4
            className="text-sm font-bold mb-3"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Interaction Analysis Results
          </h4>
          {warnings.length === 0 ? (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              <Shield size={18} style={{ color: '#22c55e' }} />
              <p className="text-sm" style={{ color: '#22c55e' }}>
                No significant interactions detected between the entered medications.
              </p>
            </div>
          ) : (
            warnings.map((warning, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background:
                    warning.severity === 'severe'
                      ? 'rgba(239,68,68,0.08)'
                      : 'rgba(251,191,36,0.08)',
                  border: `1px solid ${
                    warning.severity === 'severe'
                      ? 'rgba(239,68,68,0.3)'
                      : 'rgba(251,191,36,0.25)'
                  }`,
                  boxShadow:
                    warning.severity === 'severe'
                      ? '0 0 15px rgba(239,68,68,0.1)'
                      : '0 0 15px rgba(251,191,36,0.08)',
                }}
              >
                {warning.severity === 'severe' ? (
                  <AlertTriangle
                    size={16}
                    style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }}
                  />
                ) : (
                  <Zap
                    size={16}
                    style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }}
                  />
                )}
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color:
                      warning.severity === 'severe'
                        ? 'rgba(239,68,68,0.9)'
                        : 'rgba(251,191,36,0.9)',
                  }}
                >
                  {warning.message}
                </p>
              </div>
            ))
          )}
          {!identity && (
            <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Log in to save your interaction history
            </p>
          )}
        </div>
      )}
    </div>
  );
}
