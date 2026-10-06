'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Timer,
  Sparkles,
  Heart,
  Users,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  FileCode2,
  TrendingUp,
  AlertTriangle,
  Building2,
  Home,
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    category: 'Title & Vision',
    title: 'Heritage Vault',
    subtitle: 'Secure Digital Asset & Legacy Inheritance Platform',
    type: 'hero',
    bullets: [
      'Academic Title: Digital Legacy Vault – Secure Digital Asset Inheritance System',
      'Core Problem: 90% of middle-class families lose digital assets after unforeseen events',
      'The Solution: DigiLocker + Digital Will + Inactivity Safety Protocol + Memory Capsules',
    ],
    speakerNotes:
      'Good morning judges and evaluators. Today I present Heritage Vault, a startup-grade digital legacy inheritance platform designed to ensure digital assets reach loved ones seamlessly.',
  },
  {
    id: 2,
    category: 'Problem Statement',
    title: 'The Real-World Crisis',
    subtitle: 'Digital Assets Lost Forever',
    type: 'grid',
    items: [
      { title: 'Bank Accounts & Policy Papers', desc: 'Family members spend months in court without policy numbers or account credentials.' },
      { title: 'Property & Land Deeds', desc: 'Critical digital ownership papers buried in unaccessible email accounts.' },
      { title: 'Intellectual Property & Code', desc: 'Startup source code, patents, and domain keys lost forever.' },
      { title: 'Emotional Family Memories', desc: 'Precious photos, videos, and letters locked behind passwords.' },
    ],
    speakerNotes:
      'In today’s digital era, our most valuable assets are online. When an individual passes away or faces incapacity, families face huge legal hurdles due to lack of access.',
  },
  {
    id: 3,
    category: 'The Solution',
    title: 'Heritage Vault Architecture',
    subtitle: 'Encrypted Storage + Automated Inheritance Switch',
    type: 'features',
    bullets: [
      'AES-256-GCM Encrypted Storage: Files encrypted on client/server before Cloudinary upload',
      'Inactivity Safety Protocol: Automated 15, 30, 60, and 90-day activity monitoring engine',
      'Nominee & Digital Executor Controls: Assign specific assets to specific family members',
      'Gemini AI Will Generator: Automatically generates legal digital wills with PDF export',
    ],
    speakerNotes:
      'Heritage Vault acts as a safe deposit box. Users store encrypted assets, assign nominees, and the system monitors activity without exposing keys.',
  },
  {
    id: 4,
    category: 'Tech Stack',
    title: 'Modern Production Architecture',
    subtitle: 'Enterprise Security & Performance Stack',
    type: 'tech',
    techStack: [
      { name: 'Next.js 14 (App Router)', role: 'Frontend & Serverless API Routes' },
      { name: 'MongoDB Atlas & Mongoose', role: '7 Relational Schemas & Encrypted Storage' },
      { name: 'Node.js Crypto (AES-256-GCM)', role: 'Galois/Counter Mode Authenticated Encryption' },
      { name: 'Gemini AI API & pdfkit', role: 'AI Will Generator & PDF Document Export' },
      { name: 'React Native & Expo', role: 'Google Play Store Mobile Application (com.heritagevault.app)' },
      { name: 'JWT & bcryptjs', role: 'httpOnly Cookie Session & 12-round Salt Hashing' },
    ],
    speakerNotes:
      'We chose Next.js 14 and React Native to deliver a unified Web and Mobile app ready for Play Store deployment.',
  },
  {
    id: 5,
    category: 'Feature Deep-Dive',
    title: 'Inactivity Safety Protocol',
    subtitle: 'The 90-Day Escalation Workflow',
    type: 'timeline',
    timeline: [
      { stage: 'Day 15', action: '1st Warning Email with instant 1-click timer reset link' },
      { stage: 'Day 30', action: '2nd Reminder Email & security fingerprint check' },
      { stage: 'Day 60', action: 'Final Warning Email + Nominee preliminary alert notification' },
      { stage: 'Day 90', action: 'Protocol Triggered: Nominees receive assigned encrypted assets' },
    ],
    speakerNotes:
      'This feature solves the Dead Man Switch problem gracefully with 3 stages of warnings to prevent false alarms while guaranteeing transfer on Day 90.',
  },
  {
    id: 6,
    category: 'Security Architecture',
    title: 'Zero-Trust Defense System',
    subtitle: 'Military-Grade Encryption Specs',
    type: 'security',
    bullets: [
      'Ciphertext Isolation: Cloudinary holds ONLY ciphertext; encryption keys stored in MongoDB',
      'Session Hijacking Protection: JWT tokens stored exclusively in httpOnly cookies',
      'Risk Detection & Device Fingerprinting: IP + User-Agent monitoring with instant email alerts',
      'Nominee OTP Verification: Nominees must verify via 6-digit email OTP before access release',
    ],
    speakerNotes:
      'Security is paramount. Even if Cloudinary storage is breached, files remain unreadable ciphertext without master keys.',
  },
  {
    id: 7,
    category: 'Business & Market Model',
    title: 'Monetization & B2B/B2C Strategy',
    subtitle: 'Scalable Startup Revenue Streams',
    type: 'grid',
    items: [
      { title: 'B2C Freemium', desc: 'Free 500MB + 3 Nominees | Paid ₹299/mo for Unlimited Storage & AI Will' },
      { title: 'B2B Insurance Partnerships', desc: 'Partner with HDFC/LIC to ensure policyholders assign nominees digitally' },
      { title: 'B2B Law Firms Bundle', desc: 'Digital Will + Physical Will bundle offering for estate lawyers' },
      { title: 'B2B Banking Value-Add', desc: 'Premium banking value-add service for netbanking customers' },
    ],
    speakerNotes:
      'Heritage Vault has immense business potential through both direct consumer subscriptions and B2B partnerships with insurance firms.',
  },
  {
    id: 8,
    category: 'Conclusion & Demo',
    title: 'Ready for Deployment',
    subtitle: 'College Submission & Startup Launch Ready',
    type: 'summary',
    bullets: [
      'Web Dashboard Live on http://localhost:3000',
      'Google Play Store Package Configured (com.heritagevault.app)',
      '10 Dedicated Working Modules & Full Documentation',
    ],
    speakerNotes:
      'Thank you! The live system is running on localhost:3000 and ready for live evaluation. We welcome questions from the jury.',
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 grid-bg flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Glow Ambient Lights */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Controls Header */}
      <header className="flex items-center justify-between z-20 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
            <Home className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-base text-white font-['Outfit']">Heritage Vault</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Interactive Slide Deck ({currentSlide + 1} / {SLIDES.length})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showNotes ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
          </button>
        </div>
      </header>

      {/* Main Slide Card Area */}
      <main className="my-auto py-8 z-10 max-w-5xl w-full mx-auto">
        <div className="glass-panel-glow p-8 md:p-12 rounded-3xl border border-slate-800 min-h-[460px] flex flex-col justify-between relative shadow-2xl">
          {/* Category Tag */}
          <div>
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-500/20">
              {slide.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 font-['Outfit'] leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg text-slate-400 mt-1 font-medium">{slide.subtitle}</p>
          </div>

          {/* Slide Content Types */}
          <div className="my-6">
            {slide.bullets && (
              <div className="space-y-3">
                {slide.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">{bullet}</p>
                  </div>
                ))}
              </div>
            )}

            {slide.items && (
              <div className="grid md:grid-cols-2 gap-4">
                {slide.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1">
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {slide.techStack && (
              <div className="grid md:grid-cols-2 gap-3">
                {slide.techStack.map((t, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">{t.name}</span>
                      <span className="text-xs text-slate-400">{t.role}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}

            {slide.timeline && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slide.timeline.map((t, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                    <span className="px-2.5 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-extrabold inline-block">
                      {t.stage}
                    </span>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">{t.action}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Speaker Notes Drawer */}
          {showNotes && (
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                🎙️ Speaker Notes (Viva & Pitch Guide):
              </span>
              <p className="text-xs font-mono text-slate-300 italic">{slide.speakerNotes}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation Bar */}
      <footer className="flex items-center justify-between z-20 pt-4 border-t border-slate-800/80 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-sky-400' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide === SLIDES.length - 1}
            className="p-3 bg-sky-400 hover:bg-sky-300 disabled:opacity-30 text-slate-950 rounded-xl font-bold flex items-center gap-2 text-xs shadow-lg shadow-sky-400/20"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
