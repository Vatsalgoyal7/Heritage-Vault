'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Sidebar } from '../components/Navbar';
import {
  CheckCircle2,
  Zap,
  Star,
  Users,
  Brain,
  Shield,
  Crown,
} from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-2 pt-4">
            <h1 className="text-3xl md:text-4xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
              Simple, Transparent Pricing
            </h1>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start for free with 500MB encrypted storage, or upgrade for unlimited nominees and priority notary verification.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Free Tier */}
            <div className="p-6 rounded-3xl border space-y-5 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>STARTER</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Free Vault</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>$0</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ forever</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Essential digital legacy protection for individuals.</p>
                <ul className="space-y-2.5 text-xs pt-1" style={{ color: 'var(--text-primary)' }}>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>500 MB AES-256 Encrypted Storage</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>Up to 2 Designated Nominees</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>90-Day Inactivity Safety Switch</span></li>
                </ul>
              </div>
              <div className="px-3 py-2.5 rounded-xl text-center text-xs font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                ✅ Current Plan
              </div>
            </div>

            {/* Pro Tier */}
            <div className="p-6 rounded-3xl border space-y-5 flex flex-col justify-between shadow-2xl relative transition-all hover:scale-[1.02]" style={{ background: 'var(--bg-card)', borderColor: 'var(--accent)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>FAMILY ESTATE</span>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Pro Vault</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--accent)' }}>$12</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Complete legacy security for families & businesses.</p>
                <ul className="space-y-2.5 text-xs pt-1" style={{ color: 'var(--text-primary)' }}>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>50 GB Encrypted Storage</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>Unlimited Nominees & Executors</span></li>
                  <li className="flex items-center gap-2"><Brain className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>AI Will Generator & Legal PDF Export</span></li>
                  <li className="flex items-center gap-2"><Zap className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>Priority Emergency Access</span></li>
                </ul>
              </div>
              <button
                className="w-full py-3 rounded-xl font-bold text-xs text-center shadow-lg transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                onClick={() => alert('Stripe payment coming soon!')}
              >
                Upgrade to Pro — $12/mo
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-6 rounded-3xl border space-y-5 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>ENTERPRISE</span>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Executive Vault</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>$49</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ month</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>For business founders & high net-worth estates.</p>
                <ul className="space-y-2.5 text-xs pt-1" style={{ color: 'var(--text-primary)' }}>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} /><span>500 GB Encrypted Storage</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} /><span>Notary Verification & Legal Audit</span></li>
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} /><span>Dedicated Account Manager</span></li>
                  <li className="flex items-center gap-2"><Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} /><span>Blockchain Audit Trail</span></li>
                </ul>
              </div>
              <button
                className="w-full py-3 rounded-xl border text-center font-bold text-xs transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                onClick={() => window.open('mailto:sales@heritagevault.app?subject=Executive Vault Inquiry')}
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-4 rounded-2xl border text-center text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            🔐 All plans include AES-256-GCM encryption, Telegram secure storage & inactivity protocol. No credit card required for Free tier.
          </div>
        </main>
      </div>
    </div>
  );
}