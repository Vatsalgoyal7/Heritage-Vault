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
    <div className="min-h-screen grid-bg flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
            ZERO-KNOWLEDGE SECURITY ARCHITECTURE
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
            Military-Grade Encryption & Audit Logging
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            Your data is protected by authenticated AES-256-GCM encryption with separate initialization vector (IV) and authentication tag storage.
          </p>
        </div>

        {/* Security Pillars */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border space-y-6 shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <LockKeyhole className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-2xl font-['Outfit']" style={{ color: 'var(--text-primary)' }}>AES-256-GCM Encryption</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Every secret item saved to the vault passes through standard AES-256-GCM encryption. Ciphertexts are masked in GET API responses to prevent accidental data leaks over network calls.
            </p>
            <ul className="space-y-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>256-bit Key Encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>Unique Random IV per Item</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>On-Demand Decryption API Verification</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl border space-y-6 shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent2)' }}>
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-2xl font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Immutable Security Audit Logs</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Every system event — from account creation to asset decryption — is logged to an audit trail with timestamping and status verification.
            </p>
            <ul className="space-y-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>Encrypted Audit Trail Entries</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>IP & User ID Event Matching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span>GDPR Compliant Privacy Architecture</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
