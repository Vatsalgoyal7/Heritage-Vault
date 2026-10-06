'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  Users,
  Brain,
  ArrowRight,
} from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen grid-bg flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Simple, Transparent Pricing</h1>
        <p className="text-sm md:text-base max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Start for free with 500MB encrypted storage, or upgrade for unlimited nominees and priority notary verification.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl border space-y-6 flex flex-col justify-between shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>STARTER</span>
              <h3 className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Free Vault</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>$0</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ forever</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Essential digital legacy protection for individuals.</p>
              <ul className="space-y-3 text-xs pt-2" style={{ color: 'var(--text-primary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>500 MB AES-256 Encrypted Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>Up to 2 Designated Nominees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>90-Day Inactivity Safety Switch</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login?mode=register"
              className="w-full py-3 rounded-xl border text-center font-bold text-xs block transition-all hover:brightness-110"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl border space-y-6 flex flex-col justify-between shadow-2xl relative" style={{ background: 'var(--bg-card)', borderColor: 'var(--accent)' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>FAMILY ESTATE</span>
              <h3 className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Pro Vault</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--accent)' }}>$12</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ month</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Complete legacy security for families & businesses.</p>
              <ul className="space-y-3 text-xs pt-2" style={{ color: 'var(--text-primary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>50 GB Encrypted Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>Unlimited Nominees & Executors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>AI Will Generator & Legal PDF Export</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login?mode=register"
              className="w-full py-3 rounded-xl font-bold text-xs text-center block shadow-lg transition-all hover:brightness-110"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Business Tier */}
          <div className="p-8 rounded-3xl border space-y-6 flex flex-col justify-between shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>ENTERPRISE</span>
              <h3 className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Executive Vault</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>$49</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ month</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>For business founders & high net-worth estates.</p>
              <ul className="space-y-3 text-xs pt-2" style={{ color: 'var(--text-primary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>500 GB Encrypted Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span>Notary Verification & Legal Audit</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login?mode=register"
              className="w-full py-3 rounded-xl border text-center font-bold text-xs block transition-all hover:brightness-110"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}