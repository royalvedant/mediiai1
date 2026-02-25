import { useState, useRef, useCallback } from 'react';
import { CloudUpload, CheckCircle, Loader } from 'lucide-react';

type UploadState = 'idle' | 'dragging' | 'scanning' | 'complete';

export default function PrescriptionUploader() {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = useCallback(() => {
    setState('scanning');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setState('complete');
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 80);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      if (e.dataTransfer.files.length > 0) startScan();
    },
    [startScan]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) startScan();
    },
    [startScan]
  );

  const reset = () => {
    setState('idle');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Drop prescription here or click to upload';
      case 'dragging': return 'Release to upload prescription';
      case 'scanning': return `Analyzing prescription... ${Math.round(progress)}%`;
      case 'complete': return 'Analysis complete ✓';
    }
  };

  const getBorderColor = () => {
    if (state === 'dragging') return 'rgba(0,212,255,0.8)';
    if (state === 'complete') return 'rgba(0,255,150,0.6)';
    if (state === 'scanning') return 'rgba(0,212,255,0.5)';
    return 'rgba(0,212,255,0.25)';
  };

  const getGlow = () => {
    if (state === 'dragging') return '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.25)';
    if (state === 'complete') return '0 0 20px rgba(0,255,150,0.4)';
    if (state === 'scanning') return '0 0 20px rgba(0,212,255,0.3)';
    return 'none';
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(10,22,40,0.5)',
        backdropFilter: 'blur(16px)',
        border: `2px dashed ${getBorderColor()}`,
        boxShadow: getGlow(),
      }}
      onDragOver={(e) => { e.preventDefault(); setState('dragging'); }}
      onDragLeave={() => setState('idle')}
      onDrop={handleDrop}
      onClick={() => state === 'idle' && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Scan line animation */}
      {state === 'scanning' && (
        <div
          className="absolute left-0 right-0 h-0.5 pointer-events-none scan-line"
          style={{
            background: 'linear-gradient(90deg, transparent, #00d4ff, #00fff0, #00d4ff, transparent)',
            boxShadow: '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.5)',
            zIndex: 10,
          }}
        />
      )}

      <div className="flex flex-col items-center justify-center py-10 px-6 gap-4">
        {/* Icon */}
        <div className="relative">
          {state === 'complete' ? (
            <CheckCircle size={48} style={{ color: '#00ff96', filter: 'drop-shadow(0 0 10px #00ff96)' }} />
          ) : state === 'scanning' ? (
            <Loader size={48} style={{ color: '#00d4ff', animation: 'spin 1s linear infinite' }} />
          ) : (
            <CloudUpload
              size={48}
              style={{
                color: state === 'dragging' ? '#00fff0' : '#00d4ff',
                filter: `drop-shadow(0 0 ${state === 'dragging' ? '15px' : '8px'} #00d4ff)`,
                transition: 'all 0.3s ease',
              }}
            />
          )}
        </div>

        {/* Status text */}
        <p
          className="text-sm font-medium text-center"
          style={{
            color: state === 'complete' ? '#00ff96' : state === 'dragging' ? '#00fff0' : 'rgba(255,255,255,0.7)',
          }}
        >
          {getStatusText()}
        </p>

        {/* Progress bar */}
        {(state === 'scanning' || state === 'complete') && (
          <div className="w-full max-w-xs">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: state === 'complete'
                    ? 'linear-gradient(90deg, #00ff96, #00d4ff)'
                    : 'linear-gradient(90deg, #00d4ff, #00fff0)',
                  boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                }}
              />
            </div>
          </div>
        )}

        {/* Supported formats */}
        {state === 'idle' && (
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Supports PDF, JPG, PNG • Max 10MB
          </p>
        )}

        {/* Reset button */}
        {state === 'complete' && (
          <button
            className="text-xs px-4 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
            }}
            onClick={(e) => { e.stopPropagation(); reset(); }}
          >
            Upload Another
          </button>
        )}
      </div>
    </div>
  );
}
