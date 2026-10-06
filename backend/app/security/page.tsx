'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Lock,
  Key,
  FileText,
  CheckCircle2,
  LockKeyhole,
  Cpu,
  EyeOff,
  Server,
  ArrowRight,
} from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            ZERO-KNOWLEDGE SECURITY ARCHITECTURE
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white font-['Outfit']">
            Military-Grade Encryption & Audit Logging
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Your data is protected by authenticated AES-256-GCM encryption with separate initialization vector (IV) and authentication tag storage.
          </p>
        </div>

        {/* Security Pillars */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-2xl text-white font-['Outfit']">AES-256-GCM Encryption</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every secret item saved to the vault passes through standard AES-256-GCM encryption. Ciphertexts are masked in GET API responses to prevent accidental data leaks over network calls.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>256-bit Key Encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unique Random IV per Item</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>On-Demand Decryption API Verification</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-2xl text-white font-['Outfit']">Immutable Audit Trail</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every security action—including decryptions, nominee additions, and emergency access requests—is logged with timestamps, IP addresses, and performer identities.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Security Auditing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Encrypted Activity Logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Full Owner Visibility</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="glass-panel-glow p-8 rounded-3xl border border-emerald-500/40 space-y-6">
          <h3 className="text-xl font-bold text-white font-['Outfit']">Technical Security Specifications</h3>
          <div className="grid md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Algorithm</span>
              <p className="text-emerald-400 font-bold">AES-256-GCM</p>
            </div>
            <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Key Hashing</span>
              <p className="text-cyan-400 font-bold">Bcrypt Salt 10</p>
            </div>
            <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Auth Tokens</span>
              <p className="text-purple-400 font-bold">JWT Signed</p>
            </div>
            <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Data Storage</span>
              <p className="text-amber-400 font-bold">JSON DB / Mongo</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
