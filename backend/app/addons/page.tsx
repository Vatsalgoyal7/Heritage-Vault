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
    <div className="min-h-screen grid-bg flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
            HERITAGE EXTENSIONS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
            Premium Cyber Add-ons
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
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
              title: 'Emergency Crisis Override',
              description: 'Instant time-locked emergency access workflow for verified family nominees during medical emergencies.',
              status: 'Included in Vault',
            },
            {
              icon: LockKeyhole,
              title: 'Hardware Token Sync',
              description: 'Support for YubiKey and WebAuthn hardware security keys for zero-knowledge vault unlock.',
              status: 'Add-on Module',
            },
            {
              icon: Star,
              title: 'Personal Concierge Support',
              description: 'Dedicated estate planning specialist assistance for setting up complex digital inheritance vaults.',
              status: 'Executive Plan',
            },
          ].map((addon) => {
            const Icon = addon.icon;
            return (
              <div key={addon.title} className="p-6 rounded-3xl border space-y-4 shadow-xl flex flex-col justify-between" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{addon.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{addon.description}</p>
                </div>
                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] font-bold uppercase font-mono tracking-wider" style={{ color: 'var(--accent)' }}>{addon.status}</span>
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
