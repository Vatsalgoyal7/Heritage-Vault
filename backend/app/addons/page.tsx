'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Brain,
  Globe,
  Shield,
  Zap,
  Star,
  LockKeyhole,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AddonsPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            HERITAGE EXTENSIONS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white font-['Outfit']">
            Premium Cyber Add-ons
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Extend your vault inheritance capabilities with AI legal drafting, notary verification, and biometric security suites.
          </p>
        </div>

        {/* Add-on Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'Gemini AI Will Generator',
              description: 'Draft legally formatted asset inheritance declarations with customizable clauses and printable PDF exports.',
              status: 'Included in Vault',
            },
            {
              icon: Globe,
              title: 'International Notary Sync',
              description: 'Cross-border digital notarization verification for multi-jurisdictional property and crypto holdings.',
              status: 'Add-on Module',
            },
            {
              icon: Shield,
              title: 'Blockchain Verification',
              description: 'Immutable ledger hashing for vault asset transfers and nominee authorization proof.',
              status: 'Included in Vault',
            },
            {
              icon: Zap,
              title: 'Instant Emergency Override',
              description: 'Urgent 24-hour nominee access authorization with real-time OTP notification dispatch.',
              status: 'Included in Vault',
            },
            {
              icon: Star,
              title: 'Family Memorial Suite',
              description: 'Curate digital memory capsules, video messages, and family audio archives for future generations.',
              status: 'Included in Vault',
            },
            {
              icon: LockKeyhole,
              title: 'Biometric Master Key',
              description: 'WebAuthn hardware key and biometric fingerprint verification for master vault unlock.',
              status: 'Add-on Module',
            },
          ].map((addon, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                  <addon.icon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                  {addon.status}
                </span>
              </div>
              <h3 className="font-bold text-xl text-white font-['Outfit']">{addon.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{addon.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
