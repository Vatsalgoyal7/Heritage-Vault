'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Lock, Eye, Download, AlertTriangle, KeyRound, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function FamilyPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('father@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignedItems, setAssignedItems] = useState<any[]>([]);

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
            owner: 'Vault Owner (Son)',
            content: 'Plot No 14, Survey No 402/12, Registration Certificate ID: REG-2024-MH-9982',
            accessLevel: 'Download & View Allowed',
            date: '2026-08-01',
          },
          {
            id: 'nominee_item_2',
            title: 'HDFC NetBanking & Health Policy Details',
            category: 'Banking & Insurance',
            owner: 'Vault Owner (Son)',
            content: 'User: rakesh_h123 | Policy No: HDFC-HEALTH-991823 | PIN: 4892',
            accessLevel: 'Download & View Allowed',
            date: '2026-08-01',
          },
        ]);
      } else {
        setError('Invalid OTP code. Use 123456 for demo verification.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-[#090e1a]/90 backdrop-blur-md px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white font-['Outfit']">Heritage Vault</span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
            Family & Nominee Portal
          </span>
        </Link>

        {isLoggedIn && (
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setStep('email');
              setOtp('');
            }}
            className="text-xs font-semibold text-rose-400 hover:underline"
          >
            Sign Out Nominee Portal
          </button>
        )}
      </header>

      {!isLoggedIn ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel-glow p-8 rounded-3xl border border-emerald-500/40 space-y-6">
            <div className="text-center space-y-2">
              <UserCheck className="w-12 h-12 mx-auto text-emerald-400" />
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Nominee Verification Portal</h2>
              <p className="text-xs text-slate-400">
                Log in with your designated nominee email to access inheritance items assigned to you.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 text-center">
                {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nominee Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="father@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send 6-Digit Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#050b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white text-center font-mono text-lg tracking-widest focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-400 mt-1.5 text-center font-mono">✓ Demo OTP sent to {email} (Use: 123456)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Open Nominee Dashboard'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-xs text-slate-400 hover:text-white transition-colors text-center"
                >
                  ← Change Email Address
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white font-['Outfit']">Welcome, Designated Nominee</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                  Verified Identity
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-white font-semibold">{email}</span>. Displaying assigned assets granted via Heritage Vault Protocol.
              </p>
            </div>
            <div className="px-3.5 py-2 bg-[#050b14] border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Inactivity Safety Protocol Authorization Active</span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white font-['Outfit']">Assigned Vault Assets</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {assignedItems.map((item) => (
              <div key={item.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400">Category: {item.category} • Owner: {item.owner}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold rounded-full">
                    {item.accessLevel}
                  </span>
                </div>

                <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 font-mono text-xs text-emerald-300">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    ✓ Verified Asset Secret:
                  </span>
                  <p>{item.content}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-emerald-400">Status: Access Granted</span>
                  <span className="text-[10px] text-slate-500 font-mono">Released: {item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
