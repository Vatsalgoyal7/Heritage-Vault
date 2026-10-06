'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Timer, Heart, Users, ArrowRight,
  Sparkles, CheckCircle2, Brain, Zap, Globe, Menu, X,
  KeyRound, FileText, Shield, Star, ChevronRight,
  Eye, Fingerprint, Cloud, Bell, Award, TrendingUp,
} from 'lucide-react';
import { PublicNavbar } from './components/PublicNavbar';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const users = useCountUp(12400, 2000, statsVisible);
  const assets = useCountUp(98000, 2200, statsVisible);
  const uptime = useCountUp(99, 1500, statsVisible);
  const countries = useCountUp(47, 1800, statsVisible);

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
      label: 'AES-256 Encryption',
      tag: 'CORE SECURITY',
      desc: 'Military-grade client-side encryption. Your plaintext never touches our servers — zero-knowledge architecture.',
    },
    {
      icon: <Timer className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20',
      label: '90-Day Safety Protocol',
      tag: 'AUTOMATION',
      desc: 'Heartbeat cron monitors your activity. 90 days of inactivity triggers a multi-stage estate release to nominees.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      color: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/20',
      label: 'Nominee Management',
      tag: 'INHERITANCE',
      desc: 'Designate family members with granular permissions — view-only, download, or full access per asset category.',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-500/20',
      label: 'AI Will Generator',
      tag: 'AI LEGAL TECH',
      desc: 'Gemini AI drafts a legally-structured digital will from your vault profile. Exportable as PDF/printed document.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-500',
      glow: 'shadow-orange-500/20',
      label: 'Memory Capsules',
      tag: 'PERSONAL MEMORY',
      desc: 'Record voice notes, videos, and personal letters — delivered to loved ones only after estate release.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-lime-500',
      glow: 'shadow-yellow-500/20',
      label: 'Emergency Access',
      tag: 'CRISIS PROTOCOL',
      desc: 'One-click emergency mode lets nominees request urgent access. Smart approval workflows with time-locked security.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Secure Vault',
      desc: 'Sign up with email + MFA. Your encryption keys are generated client-side and never shared.',
      icon: <KeyRound className="w-5 h-5" />,
      color: 'text-emerald-400',
    },
    {
      num: '02',
      title: 'Store & Encrypt Assets',
      desc: 'Upload passwords, property docs, crypto seeds, insurance policies — all encrypted before upload.',
      icon: <Lock className="w-5 h-5" />,
      color: 'text-cyan-400',
    },
    {
      num: '03',
      title: 'Assign Your Nominees',
      desc: 'Add family members with specific access levels. They receive an OTP-verified secure portal link.',
      icon: <Users className="w-5 h-5" />,
      color: 'text-violet-400',
    },
    {
      num: '04',
      title: 'Automatic Inheritance',
      desc: 'Stay active to keep assets locked. If inactive 90 days, assets are automatically released to nominees.',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-pink-400',
    },
  ];

  const testimonials = [
    {
      name: 'Arjun Mehta',
      role: 'Software Engineer, Bangalore',
      text: 'Heritage Vault gave me peace of mind. My family will have access to everything they need — passwords, insurance, crypto — without any confusion.',
      stars: 5,
      avatar: 'AM',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Priya Sharma',
      role: 'Financial Advisor, Mumbai',
      text: 'I recommend this to all my clients now. The AI Will generator alone saved hours of legal work. The encryption is enterprise-grade.',
      stars: 5,
      avatar: 'PS',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Vikram Nair',
      role: 'Business Owner, Delhi',
      text: 'The 90-day safety protocol is genius. My business documents and crypto wallet are protected with an automatic inheritance system.',
      stars: 5,
      avatar: 'VN',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  const trustBadges = [
    { icon: <Shield className="w-5 h-5" />, label: 'AES-256-GCM' },
    { icon: <Eye className="w-5 h-5" />, label: 'Zero Knowledge' },
    { icon: <Fingerprint className="w-5 h-5" />, label: 'MFA Protected' },
    { icon: <Cloud className="w-5 h-5" />, label: '99.9% Uptime' },
    { icon: <Globe className="w-5 h-5" />, label: '47 Countries' },
    { icon: <Award className="w-5 h-5" />, label: 'SOC 2 Ready' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300 theme-bg">
      {/* Background grid + glows */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />
      <div className="fixed top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'var(--accent)', opacity: 0.06 }} />
      <div className="fixed bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'var(--accent2)', opacity: 0.06 }} />

      {/* Navbar */}
      <div className="relative z-50">
        <PublicNavbar />
      </div>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative pt-24 pb-20 px-6 text-center z-10">
        {/* Animated accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px"
              style={{
                background: `linear-gradient(to bottom, transparent, var(--accent), transparent)`,
                opacity: 0.15,
                left: `${20 + i * 15}%`,
                top: 0,
                bottom: 0,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest mb-8 animate-pulse-slow"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--accent)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Digital Legacy Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="block" style={{ color: 'var(--text-primary)' }}>Your Digital Life.</span>
            <span className="block" style={{ color: 'var(--accent)' }}>
              Secured. Inherited.
            </span>
            <span className="block" style={{ color: 'var(--text-primary)' }}>Forever.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Heritage Vault encrypts your passwords, property docs, crypto seeds & memories —
            then automatically delivers them to your family when it matters most.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/login?mode=register"
              className="group px-8 py-4 rounded-xl text-base font-bold hover:brightness-110 shadow-xl transition-all flex items-center gap-3"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)', boxShadow: '0 10px 30px -8px var(--accent)' }}
            >
              <Lock className="w-5 h-5" />
              <span>Start Free — No Card Needed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 rounded-xl text-base font-semibold border transition-all flex items-center gap-3 backdrop-blur-sm"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300"
              >
                <span className="text-emerald-400">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>

          {/* Hero dashboard mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
            <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-1 backdrop-blur-sm shadow-2xl shadow-emerald-500/5">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <div className="ml-4 flex-1 bg-slate-800 rounded-lg px-4 py-1.5 text-xs text-slate-500 text-left">
                  app.heritagevault.io/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Vault Items', value: '24', icon: '🔐', color: 'emerald' },
                  { label: 'Nominees', value: '3', icon: '👥', color: 'cyan' },
                  { label: 'Legacy Score', value: '94%', icon: '⭐', color: 'violet' },
                ].map((card) => (
                  <div key={card.label} className={`bg-slate-800/80 rounded-xl p-4 border border-slate-700 text-left`}>
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className={`text-2xl font-black text-${card.color}-400`}>{card.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{card.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Safety Protocol Status</span>
                    <span className="text-xs text-slate-500">Last active: Today</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full w-[95%] transition-all" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Day 0 (Active)</span>
                    <span>Day 90 → Release</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section ref={statsRef} className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: users.toLocaleString() + '+', label: 'Users Protected', icon: <Users className="w-5 h-5" />, color: 'emerald' },
            { value: assets.toLocaleString() + '+', label: 'Assets Encrypted', icon: <Lock className="w-5 h-5" />, color: 'cyan' },
            { value: uptime + '.9%', label: 'Uptime SLA', icon: <TrendingUp className="w-5 h-5" />, color: 'violet' },
            { value: countries + '+', label: 'Countries', icon: <Globe className="w-5 h-5" />, color: 'pink' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 flex items-center justify-center mx-auto mb-4`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── FEATURES ─────────────────── */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Shield className="w-3.5 h-3.5" /> Feature Suite
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything Your Family Needs.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Nothing They Don&apos;t.
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built for real-world digital estates — not just password managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.label}
                className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} p-0.5 shadow-lg ${f.glow} flex-shrink-0`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                      {f.icon}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{f.tag}</span>
                    <h3 className="font-bold text-lg text-white">{f.label}</h3>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-emerald-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" /> How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Set Up in{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                10 Minutes.
              </span>{' '}
              Protected Forever.
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/50 via-cyan-500/50 to-violet-500/50 hidden md:block" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step.num} className="flex gap-6 items-start group">
                  <div className={`relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-emerald-500/40 flex items-center justify-center flex-shrink-0 transition-all ${step.color}`}>
                    <span className="font-black text-lg">{step.num}</span>
                  </div>
                  <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 group-hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={step.color}>{step.icon}</span>
                      <h3 className="font-bold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECURITY STRIP ─────────────────── */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-violet-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Security First
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Zero-Knowledge.{' '}
                <span className="text-emerald-400">Zero Compromise.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Your encryption keys never leave your device. We use AES-256-GCM encryption — the same standard used by military and banking institutions.
              </p>
              <div className="space-y-3">
                {[
                  'Client-side encryption before upload',
                  'We cannot read your data — ever',
                  'Multi-factor authentication required',
                  'Audit log for every access event',
                  'Automatic key rotation every 90 days',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'AES-256-GCM', sublabel: 'Encryption Standard', icon: '🛡️' },
                { label: 'Zero-Knowledge', sublabel: 'Architecture', icon: '👁️' },
                { label: 'MFA', sublabel: 'Two-Factor Auth', icon: '🔐' },
                { label: 'SOC 2 Ready', sublabel: 'Compliance', icon: '✅' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-bold text-sm text-emerald-400">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── TESTIMONIALS ─────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3.5 h-3.5" /> Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Trusted By{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Thousands
              </span>{' '}
              of Families
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA SECTION ─────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-violet-500/10 border border-emerald-500/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/10 blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="text-5xl mb-6">🛡️</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Your Legacy Starts{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Today
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                Join 12,400+ families who have secured their digital assets. Free plan forever — upgrade when you&apos;re ready.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login?mode=register"
                  className="group px-10 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-3"
                >
                  <Lock className="w-5 h-5" />
                  <span>Create Your Free Vault</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-10 py-4 rounded-xl text-base font-semibold border border-slate-700 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                >
                  View Pricing
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-500">No credit card required · GDPR Compliant · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="border-t border-slate-800/60 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-sm text-white">Heritage Vault</span>
                  <span className="block text-[9px] text-emerald-400 uppercase tracking-widest">Digital Legacy System</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Securing digital estates with military-grade encryption and automated inheritance protocols.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  { href: '/features', label: 'Features' },
                  { href: '/security', label: 'Security' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/addons', label: 'Add-ons' },
                ],
              },
              {
                title: 'Learn',
                links: [
                  { href: '/safety', label: 'Safety Protocol' },
                  { href: '/help', label: 'Help Center' },
                  { href: '/about', label: 'About Us' },
                ],
              },
              {
                title: 'Account',
                links: [
                  { href: '/login?mode=register', label: 'Get Started' },
                  { href: '/login?mode=login', label: 'Sign In' },
                  { href: '/family-portal', label: 'Family Portal' },
                  { href: '/dashboard', label: 'Dashboard' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <span>© 2025 Heritage Vault. All rights reserved.</span>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}