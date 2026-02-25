import { useState } from 'react';
import { useRequestAmbulance } from '../hooks/useMediAIQueries';

interface EmergencyCTAProps {
    onRequested: (caseId: string) => void;
}

export default function EmergencyCTA({ onRequested }: EmergencyCTAProps) {
    const [isLocating, setIsLocating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { mutateAsync: requestAmbulance, isPending } = useRequestAmbulance();

    const handleEmergencyClick = () => {
        if (!navigator.geolocation) {
            setErrorMsg('Geolocation is not supported by your browser.');
            return;
        }

        setIsLocating(true);
        setErrorMsg('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const caseId = await requestAmbulance({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIsLocating(false);
                    onRequested(caseId);
                } catch (err: any) {
                    console.error("Failed to request ambulance:", err);
                    setErrorMsg(err.message || 'Failed to request ambulance. Please try again.');
                    setIsLocating(false);
                }
            },
            (geoError) => {
                console.error("Geolocation error:", geoError);
                setErrorMsg('Unable to retrieve your location. Please ensure location services are enabled.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleEmergencyClick}
                disabled={isLocating || isPending}
                className={`
          relative group overflow-hidden rounded-full font-black text-lg tracking-widest uppercase transition-all duration-300
          ${isLocating || isPending ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'}
        `}
                style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    padding: '16px 32px',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                {/* Pulse animation for the emergency button */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-red-400"></span>

                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                    }}
                ></div>

                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLocating || isPending ? (
                        <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isLocating ? 'Locating...' : 'Dispatching...'}
                        </>
                    ) : (
                        <>
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Emergency Ambulance
                        </>
                    )}
                </span>
            </button>

            {errorMsg && (
                <div className="mt-4 px-4 py-2 rounded-lg bg-red-900/50 border border-red-500/50 text-red-100 text-sm max-w-sm text-center">
                    ⚠️ {errorMsg}
                </div>
            )}
        </div>
    );
}
