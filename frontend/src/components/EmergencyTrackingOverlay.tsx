import { useEffect, useState } from 'react';
import { useEmergencyStatus } from '../hooks/useMediAIQueries';

interface EmergencyTrackingOverlayProps {
    caseId: string;
    onClose: () => void;
}

export default function EmergencyTrackingOverlay({ caseId, onClose }: EmergencyTrackingOverlayProps) {
    const { data: statusRecord, isLoading } = useEmergencyStatus(caseId);
    const [eta, setEta] = useState(8);

    useEffect(() => {
        const timer = setInterval(() => {
            setEta((prev) => (prev > 1 ? prev - 1 : 1));
        }, 60000); // Reduce ETA every minute for simulation
        return () => clearInterval(timer);
    }, []);

    const currentStatusObject = statusRecord?.status;
    const statusString = currentStatusObject ? Object.keys(currentStatusObject)[0] : 'Unknown';

    const statusSteps = ['Requested', 'Dispatched', 'Arriving', 'Arrived', 'Completed'];
    const currentIndex = statusSteps.indexOf(statusString);
    const progressPercentage = currentIndex >= 0 ? (currentIndex / (statusSteps.length - 1)) * 100 : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-xl transition-all duration-500">
            {/* Background Pulse Effect */}
            <div className="absolute inset-0 z-0 bg-red-900/10 pointer-events-none animate-pulse duration-1000"></div>

            {/* Main Hologram Panel */}
            <div
                className="relative z-10 w-full max-w-lg p-8 rounded-3xl overflow-hidden border border-red-500/30"
                style={{
                    background: 'rgba(10, 0, 0, 0.7)',
                    boxShadow: '0 0 50px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)',
                }}
            >
                <div className="text-center mb-8 relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-500/20 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                        <svg className="w-10 h-10 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-red-100 tracking-wider">
                        EMERGENCY ASSISTANCE DETECTED
                    </h2>
                    <p className="text-red-300/80 text-sm mt-2 font-mono">
                        ID: #{caseId.split('-')[0]}
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center text-red-200/50 py-10 animate-pulse font-mono flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Syncing ICP On-Chain Status...
                    </div>
                ) : (
                    <div className="space-y-8 relative">

                        {/* ETA Display */}
                        {currentIndex < 3 && (
                            <div className="text-center p-6 rounded-2xl bg-red-950/40 border border-red-500/20 backdrop-blur-md">
                                <p className="text-xs uppercase tracking-[0.2em] text-red-300/60 mb-2">Estimated Arrival in</p>
                                <div className="text-5xl font-black text-red-50 tracking-tighter" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}>
                                    {eta} <span className="text-2xl text-red-400">MIN</span>
                                </div>
                            </div>
                        )}

                        {/* Stepper Progress */}
                        <div className="relative pt-6 pb-2">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-red-900/40 -translate-y-1/2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercentage}%`, boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}
                                ></div>
                            </div>

                            <div className="relative flex justify-between">
                                {statusSteps.map((step, i) => (
                                    <div key={step} className="flex flex-col items-center">
                                        <div
                                            className={`
                        w-4 h-4 rounded-full transition-all duration-500
                        ${i <= currentIndex ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-red-950 border border-red-900/50'}
                      `}
                                        />
                                        <span
                                            className={`
                        absolute -bottom-6 text-[10px] uppercase tracking-widest font-mono transition-colors duration-300
                        ${i <= currentIndex ? 'text-red-200' : 'text-red-900/50'}
                      `}
                                            style={{ transform: 'translateX(-50%)', left: '50%' }}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Close / Dismiss Action */}
                        <div className="text-center mt-12 pt-6 border-t border-red-900/30">
                            <button
                                onClick={onClose}
                                className="text-xs font-mono uppercase tracking-[0.1em] text-red-400 hover:text-white transition-colors"
                            >
                                [ Minimize to Dashboard ]
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
