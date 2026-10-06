'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Lock,
  Timer,
  Users,
  Heart,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileCode2,
  LockKeyhole,
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            COMPREHENSIVE FEATURE SUITE
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white font-['Outfit']">
            Next-Gen Digital Asset Protection
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Heritage Vault combines zero-knowledge AES-256 encryption, automated safety protocols, AI legal wills, and nominee management into a unified platform.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'AES-256-GCM Military Encryption',
              description: 'Client and server-side encryption for passkeys, deeds, bank logins, and crypto seed phrases. Plaintext never touches raw storage.',
              badge: 'Core Security',
            },
            {
              icon: Timer,
              title: '90-Day Inactivity Safety Switch',
              description: 'Automated heartbeat cron checks track owner logins. If inactive for 90 days, automated multi-stage release unlocks nominee permissions.',
              badge: 'Automated Protocol',
            },
            {
              icon: Users,
              title: 'Granular Nominee Permissions',
              description: 'Designate specific family members (Father, Mother, Spouse) to specific categories with view-only or download access controls.',
              badge: 'Family Inheritance',
            },
            {
              icon: Heart,
              title: 'Emotional Memory Capsules',
              description: 'Record private letters, voice messages, or video memories delivered to loved ones upon safety protocol activation.',
              badge: 'Personal Memory',
            },
            {
              icon: Brain,
              title: 'Gemini AI Will Generator',
              description: 'Draft legal-grade digital asset inheritance documents mapping vault secrets to executors with instant PDF export and print formatting.',
              badge: 'AI Legal Tech',
            },
            {
              icon: Zap,
              title: 'Emergency Override Request',
              description: 'Verified nominees can request 24-hour emergency access during sudden medical situations, subject to owner authorization.',
              badge: 'Emergency Access',
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#050b14] text-cyan-400 border border-cyan-500/30 font-mono uppercase">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-xl text-white font-['Outfit']">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-panel-glow p-8 md:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold text-white font-['Outfit']">Ready to Secure Your Digital Legacy?</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto">
            Create your free vault account in under 2 minutes and protect your passwords, documents, and memory capsules today.
          </p>
          <Link
            href="/login?mode=register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Create Free Encrypted Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
