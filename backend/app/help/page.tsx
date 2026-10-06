'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Mail,
  Phone,
  HelpCircle,
  Search,
  FileText,
  Lock,
  Users,
  Timer,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-['Outfit'] text-white">Help & Support Center</h1>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto">
          Everything you need to know about encrypted vaults, safety protocols, and nominee access
        </p>
      </section>

      {/* Support Cards */}
      <section className="px-6 pb-16 max-w-7xl mx-auto w-full space-y-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Outfit']">Email Support</h3>
            <p className="text-xs text-slate-400">Get technical support via email</p>
            <a href="mailto:vatsalgoyal71@gmail.com" className="text-emerald-400 hover:underline text-xs block font-mono">
              vatsalgoyal71@gmail.com
            </a>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Outfit']">Phone Support</h3>
            <p className="text-xs text-slate-400">24/7 direct helpline</p>
            <a href="tel:+917310698091" className="text-cyan-400 hover:underline text-xs block font-mono">
              +91 7310698091
            </a>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Outfit']">FAQ & Knowledge Base</h3>
            <p className="text-xs text-slate-400">Self-help articles and setup guides</p>
            <span className="text-purple-400 text-xs font-mono">Documentation Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}