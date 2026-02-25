import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Activity, LayoutDashboard, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface NavbarProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Problem', href: '#problem' },
  { label: 'Features', href: '#features' },
  { label: 'Tools', href: '#tools' },
  { label: 'Method', href: '#method' },
  { label: 'Validation', href: '#validation' },
];

function truncatePrincipal(principal: string): string {
  if (principal.length <= 10) return principal;
  return `${principal.slice(0, 5)}...${principal.slice(-3)}`;
}

export default function Navbar({ isLightMode, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const principalDisplay = identity
    ? truncatePrincipal(identity.getPrincipal().toString())
    : null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? isLightMode
            ? 'rgba(232, 244, 255, 0.85)'
            : 'rgba(2, 8, 23, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.15)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#hero')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Activity
                size={28}
                style={{ color: '#00d4ff', filter: 'drop-shadow(0 0 8px #00d4ff)' }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
                  animation: 'orbPulse 2s ease-out infinite',
                }}
              />
            </div>
            <span
              className="text-xl font-black tracking-wider"
              style={{
                color: '#00d4ff',
                textShadow: '0 0 10px rgba(0,212,255,0.8), 0 0 20px rgba(0,212,255,0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              MediAI
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: isLightMode ? 'rgba(10,22,40,0.8)' : 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#00d4ff';
                  (e.target as HTMLElement).style.textShadow = '0 0 8px rgba(0,212,255,0.6)';
                  (e.target as HTMLElement).style.background = 'rgba(0,212,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = isLightMode
                    ? 'rgba(10,22,40,0.8)'
                    : 'rgba(255,255,255,0.7)';
                  (e.target as HTMLElement).style.textShadow = 'none';
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Dashboard link — only when authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('#dashboard')}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                style={{
                  color: '#00d4ff',
                  textShadow: '0 0 8px rgba(0,212,255,0.4)',
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0,212,255,0.3)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)';
                }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#00d4ff',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0,212,255,0.4)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)';
              }}
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Auth button */}
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                isAuthenticated
                  ? {
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.25)',
                      color: '#00d4ff',
                    }
                  : {
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.9), rgba(14,165,233,0.8))',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: '#020817',
                      boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                    }
              }
              onMouseEnter={(e) => {
                if (isAuthenticated) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }
              }}
              onMouseLeave={(e) => {
                if (isAuthenticated) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.25)';
                  (e.currentTarget as HTMLElement).style.color = '#00d4ff';
                }
              }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Logging in...
                </>
              ) : isAuthenticated ? (
                <>
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{
                      background: 'rgba(0,212,255,0.15)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      textShadow: '0 0 6px rgba(0,212,255,0.5)',
                    }}
                  >
                    {principalDisplay}
                  </span>
                  <LogOut size={14} />
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Login
                </>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#00d4ff' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: isLightMode ? 'rgba(232,244,255,0.95)' : 'rgba(2,8,23,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: isLightMode ? 'rgba(10,22,40,0.8)' : 'rgba(255,255,255,0.7)',
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Dashboard link */}
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('#dashboard')}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium rounded-lg"
                style={{
                  color: '#00d4ff',
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            )}

            {/* Mobile auth button */}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleAuth();
              }}
              disabled={isLoggingIn}
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-semibold rounded-lg mt-2"
              style={
                isAuthenticated
                  ? {
                      color: '#ef4444',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }
                  : {
                      color: '#020817',
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.9), rgba(14,165,233,0.8))',
                      border: '1px solid rgba(0,212,255,0.4)',
                    }
              }
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Logging in...
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut size={14} />
                  Logout ({principalDisplay})
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Login
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
