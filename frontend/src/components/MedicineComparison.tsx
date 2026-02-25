import { useState } from 'react';
import { Search, ExternalLink, Loader2, ShoppingCart } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSavePriceComparison } from '../hooks/useMediAIQueries';

interface PharmacyResult {
  name: string;
  url: string;
  color: string;
  glowColor: string;
}

function getPharmacyResults(medicine: string): PharmacyResult[] {
  const encoded = encodeURIComponent(medicine);
  return [
    {
      name: '1mg (Tata)',
      url: `https://www.1mg.com/search/all?name=${encoded}`,
      color: 'rgba(239,68,68,0.15)',
      glowColor: 'rgba(239,68,68,0.3)',
    },
    {
      name: 'PharmEasy',
      url: `https://pharmeasy.in/search/all?name=${encoded}`,
      color: 'rgba(34,197,94,0.15)',
      glowColor: 'rgba(34,197,94,0.3)',
    },
    {
      name: 'Netmeds',
      url: `https://www.netmeds.com/catalogsearch/result?q=${encoded}`,
      color: 'rgba(0,212,255,0.15)',
      glowColor: 'rgba(0,212,255,0.3)',
    },
  ];
}

export default function MedicineComparison() {
  const [medicine, setMedicine] = useState('');
  const [results, setResults] = useState<PharmacyResult[] | null>(null);
  const [searchedMedicine, setSearchedMedicine] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { identity } = useInternetIdentity();
  const savePriceMutation = useSavePriceComparison();

  const handleSearch = async () => {
    const trimmed = medicine.trim();
    if (!trimmed) return;

    const pharmacyResults = getPharmacyResults(trimmed);
    setResults(pharmacyResults);
    setSearchedMedicine(trimmed);

    if (identity) {
      const userId = identity.getPrincipal().toString();
      const linksJson = JSON.stringify(
        pharmacyResults.reduce(
          (acc, r) => ({ ...acc, [r.name]: r.url }),
          {} as Record<string, string>
        )
      );
      setIsSaving(true);
      try {
        await savePriceMutation.mutateAsync({ userId, medicineName: trimmed, links: linksJson });
      } catch {
        // silently fail — UI still shows results
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: 'rgba(0,212,255,0.03)',
        border: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(0,212,255,0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(14,165,233,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            boxShadow: '0 0 15px rgba(0,212,255,0.2)',
          }}
        >
          <ShoppingCart size={18} style={{ color: '#00d4ff' }} />
        </div>
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
          >
            Medicine Price Comparison
          </h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Compare prices across top Indian pharmacies
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="flex gap-3 mb-6">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Search size={16} style={{ color: 'rgba(0,212,255,0.5)', flexShrink: 0 }} />
          <input
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter medicine name (e.g. Paracetamol)"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'rgba(255,255,255,0.85)', caretColor: '#00d4ff' }}
            aria-label="Medicine name"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!medicine.trim() || isSaving}
          className="px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 flex-shrink-0"
          style={{
            background:
              medicine.trim() && !isSaving
                ? 'linear-gradient(135deg, #00d4ff, #0ea5e9)'
                : 'rgba(255,255,255,0.06)',
            color: medicine.trim() && !isSaving ? '#020817' : 'rgba(255,255,255,0.3)',
            boxShadow:
              medicine.trim() && !isSaving ? '0 0 20px rgba(0,212,255,0.4)' : 'none',
            cursor: medicine.trim() && !isSaving ? 'pointer' : 'not-allowed',
          }}
        >
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Compare
        </button>
      </div>

      {/* Results */}
      {results && (
        <div>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Showing results for{' '}
            <span style={{ color: '#00d4ff', fontWeight: 600 }}>"{searchedMedicine}"</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {results.map((pharmacy) => (
              <div
                key={pharmacy.name}
                className="rounded-xl p-5 flex flex-col gap-4"
                style={{
                  background: pharmacy.color,
                  border: `1px solid ${pharmacy.glowColor}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div>
                  <h4
                    className="font-bold text-sm mb-1"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {pharmacy.name}
                  </h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Click to view live prices
                  </p>
                </div>
                <a
                  href={pharmacy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: pharmacy.glowColor,
                    border: `1px solid ${pharmacy.glowColor}`,
                    color: 'rgba(255,255,255,0.9)',
                    textDecoration: 'none',
                    boxShadow: `0 0 12px ${pharmacy.glowColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${pharmacy.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${pharmacy.glowColor}`;
                  }}
                >
                  <ExternalLink size={12} />
                  View Price
                </a>
              </div>
            ))}
          </div>
          {!identity && (
            <p className="text-xs mt-4 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Log in to save your search history
            </p>
          )}
        </div>
      )}
    </div>
  );
}
