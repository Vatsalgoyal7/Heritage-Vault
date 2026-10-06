'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Users,
  Target,
  Award,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Mail,
  Phone,
  Info,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-['Outfit'] text-white">About Heritage Vault</h1>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto">
          Protecting digital legacies with enterprise-grade security and automated inheritance protocols
        </p>
      </section>

      {/* Mission Section */}
      <section className="px-6 pb-16 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-white font-['Outfit']">
                <Info className="w-5 h-5 text-emerald-400" />
                Our Mission
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-4">
                Heritage Vault was created to solve the growing problem of digital asset inheritance. In an increasingly digital world, your photos, documents, passwords, and cryptocurrency represent valuable assets that need protection and proper transfer mechanisms.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                We provide a secure, automated platform that ensures your digital legacy reaches the people who matter most, even when you can't be there to handle it yourself.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-white font-['Outfit']">
                <Star className="w-5 h-5 text-emerald-400" />
                Why Choose Us
              </h3>
              <ul className="space-y-3 text-xs md:text-sm text-slate-300">
                {[
                  'Bank-level AES-256-GCM encryption',
                  'Automated 90-day inactivity protocols',
                  'Gemini AI-powered digital will generation',
                  'Verified nominee OTP security',
                  '24/7 audit logging & monitoring',
                  'Compliance with digital asset standards',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}