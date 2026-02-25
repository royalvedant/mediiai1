import { useState } from 'react';
import { User, Mail, Loader2, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useMediAIQueries';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const isAuthenticated = !!identity;
  const showModal = isAuthenticated && !isLoading && isFetched && userProfile === null;

  const validateEmail = (val: string) => {
    if (!val) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val) ? '' : 'Please enter a valid email address';
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError(validateEmail(val));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (email && emailError) return;

    await saveProfileMutation.mutateAsync({ name: name.trim(), email: email.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && !emailError) {
      handleSave();
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'rgba(10,22,40,0.95)',
          border: '1px solid rgba(0,212,255,0.25)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow:
            '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.08), inset 0 1px 0 rgba(0,212,255,0.15)',
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              boxShadow: '0 0 30px rgba(0,212,255,0.2)',
            }}
          >
            <Sparkles size={28} style={{ color: '#00d4ff' }} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-black mb-2"
            style={{
              color: '#00d4ff',
              textShadow: '0 0 15px rgba(0,212,255,0.6)',
            }}
          >
            Welcome to MediAI
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Set up your profile to personalize your health experience
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name field */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: 'rgba(0,212,255,0.8)' }}
            >
              Your Name *
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${name.trim() ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.15)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              <User size={16} style={{ color: 'rgba(0,212,255,0.5)', flexShrink: 0 }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your full name"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'rgba(255,255,255,0.85)', caretColor: '#00d4ff' }}
                autoFocus
                aria-label="Full name"
                aria-required="true"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: 'rgba(0,212,255,0.8)' }}
            >
              Email Address{' '}
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span>
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  emailError
                    ? 'rgba(239,68,68,0.4)'
                    : email
                    ? 'rgba(0,212,255,0.4)'
                    : 'rgba(0,212,255,0.15)'
                }`,
                transition: 'border-color 0.2s',
              }}
            >
              <Mail size={16} style={{ color: 'rgba(0,212,255,0.5)', flexShrink: 0 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'rgba(255,255,255,0.85)', caretColor: '#00d4ff' }}
                aria-label="Email address"
              />
            </div>
            {emailError && (
              <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                {emailError}
              </p>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!name.trim() || !!emailError || saveProfileMutation.isPending}
          className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background:
              name.trim() && !emailError && !saveProfileMutation.isPending
                ? 'linear-gradient(135deg, #00d4ff, #0ea5e9)'
                : 'rgba(255,255,255,0.06)',
            color:
              name.trim() && !emailError && !saveProfileMutation.isPending
                ? '#020817'
                : 'rgba(255,255,255,0.3)',
            boxShadow:
              name.trim() && !emailError && !saveProfileMutation.isPending
                ? '0 0 25px rgba(0,212,255,0.4)'
                : 'none',
            cursor:
              name.trim() && !emailError && !saveProfileMutation.isPending
                ? 'pointer'
                : 'not-allowed',
          }}
        >
          {saveProfileMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Save Profile & Continue
            </>
          )}
        </button>

        {saveProfileMutation.isError && (
          <p className="text-xs text-center mt-3" style={{ color: '#ef4444' }}>
            Failed to save profile. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
