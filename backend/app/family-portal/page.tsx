'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Lock, Eye, Download, AlertTriangle, KeyRound, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme, THEME_OPTIONS } from '../context/ThemeContext';

export default function FamilyPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('father@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignedItems, setAssignedItems] = useState<any[]>([]);

  const { theme, toggleTheme } = useTheme();

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      console.log(`[DEMO OTP] Verification code for nominee ${email}: 123456`);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (otp === '123456' || otp.length === 6) {
        setIsLoggedIn(true);
        // Load assigned vault items
        setAssignedItems([
          {
            id: 'nominee_item_1',
            title: 'Family Ancestral Property Certificate',
            category: 'Property Documents',
            owner: 'Vault Owner (Vatsal)',
            content: 'Plot No 14, Survey No 402/12, Sector 22, Noida, UP — Registration ID: REG-2024-UP-9982 — Area: 250 sq yards — Stamp Duty Paid: ₹7,500',
            accessLevel: 'Download & View Allowed',
            date: new Date().toLocaleDateString(),
          },
          {
            id: 'nominee_item_2',
            title: 'HDFC NetBanking & FD Credentials',
            category: 'Banking & Finance',
            owner: 'Vault Owner (Vatsal)',
            content: 'HDFC Account: 5020xxxx1234 — NetBanking ID: vatsal_goyal_h — MPIN: 4892 — FD: ₹12,50,000 @ 7.1% maturity 2028',
            accessLevel: 'Download & View Allowed',
            date: new Date().toLocaleDateString(),
          },
          {
            id: 'nominee_item_3',
            title: 'LIC Policy & Health Insurance',
            category: 'Insurance',
            owner: 'Vault Owner (Vatsal)',
            content: 'LIC Policy No: 123456789 — Sum Assured: ₹50,00,000 — Nominee: Rajesh Kumar Goyal — HDFC ERGO: Policy ID HDFC-HEALTH-991823 — Agent: Anil Saxena +91 98765 11223',
            accessLevel: 'Download & View Allowed',
            date: new Date().toLocaleDateString(),
          },
          {
            id: 'nominee_item_4',
            title: 'Heritage Vault Source Code & GitHub',
            category: 'Intellectual Property',
            owner: 'Vault Owner (Vatsal)',
            content: 'GitHub: github.com/Vatsalgoyal7 — PAT Token: ghp_xxxx... — Heritage Vault Repo: /heritage-vault — Vercel API Key: ver_xxxx... — NPM: vatsal_npm',
            accessLevel: 'View Only',
            date: new Date().toLocaleDateString(),
          },
        ]);
      } else {
        setError('Invalid OTP code. Use 123456 for demo verification.');
      }
    }, 600);
  };

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme);

  return (
    <div className="min-h-screen grid-bg flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="h-16 border-b px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-40" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border-color)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Heritage Vault</span>
          <span className="text-xs px-2.5 py-0.5 rounded border font-semibold" style={{ background: 'var(--bg-secondary)', color: 'var(--accent2)', borderColor: 'var(--border-color)' }}>
            Family &amp; Nominee Portal
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--accent)' }}>
            <ArrowRight className="w-3 h-3" />
            🎯 Demo Mode · OTP: 123456
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
          >
            <span>{currentTheme?.icon}</span>
            <span className="hidden sm:inline font-['Outfit']">{currentTheme?.name}</span>
          </button>

          {isLoggedIn && (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setStep('email');
                setOtp('');
              }}
              className="text-xs font-semibold hover:underline"
              style={{ color: '#f43f5e' }}
            >
              Sign Out Nominee Portal
            </button>
          )}
        </div>
      </header>

      {!isLoggedIn ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="text-center space-y-2">
              <UserCheck className="w-12 h-12 mx-auto" style={{ color: 'var(--accent)' }} />
              <h2 className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Nominee Verification Portal</h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Log in with your designated nominee email to access inheritance items assigned to you.
              </p>
            </div>

            {error && (
              <div className="p-3 border rounded-xl text-xs text-center" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
                {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Nominee Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="father@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send 6-Digit Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none text-center font-mono text-lg tracking-widest"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <p className="text-[10px] mt-1.5 text-center font-mono" style={{ color: 'var(--accent)' }}>✓ Demo OTP sent to {email} (Use: 123456)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Open Nominee Dashboard'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-xs transition-colors text-center cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ← Change Email Address
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Welcome, Designated Nominee</h1>
                <span className="px-2.5 py-0.5 border text-[10px] font-bold rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                  Verified Identity
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Logged in as <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{email}</span>. Displaying assigned assets granted via Heritage Vault Protocol.
              </p>
            </div>
            <div className="px-3.5 py-2 border rounded-xl text-xs flex items-center gap-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Inactivity Safety Protocol Authorization Active</span>
            </div>
          </div>

          <h2 className="text-lg font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Assigned Vault Assets</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {assignedItems.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border space-y-4 shadow-lg transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Category: {item.category} • Owner: {item.owner}</p>
                  </div>
                  <span className="px-2.5 py-1 border text-[10px] font-bold rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--accent2)', borderColor: 'var(--border-color)' }}>
                    {item.accessLevel}
                  </span>
                </div>

                <div className="p-4 rounded-xl border font-mono text-xs shadow-inner" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--accent)' }}>
                    ✓ Verified Asset Secret:
                  </span>
                  <p className="font-semibold leading-relaxed">{item.content}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>Status: Access Granted</span>
                  <span className="text-[10px] font-mono">Released: {item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
