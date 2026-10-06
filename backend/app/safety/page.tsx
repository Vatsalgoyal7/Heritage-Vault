'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/PublicNavbar';
import {
  ShieldCheck,
  Timer,
  AlertTriangle,
  Users,
  CheckCircle2,
  Bell,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function SafetyPage() {
  const [simulatedDay, setSimulatedDay] = useState(12);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 grid-bg flex flex-col">
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            AUTOMATED DEAD-MAN SWITCH PROTOCOL
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white font-['Outfit']">
            90-Day Inactivity Safety Protocol
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Protects your digital legacy by automatically transferring assigned vault categories to designated family members if you become inactive.
          </p>
        </div>

        {/* Timeline Stages */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {[
            {
              day: 'Day 0 - 15',
              title: 'Active Monitoring Stage',
              desc: 'Normal vault operations. Login heartbeats reset countdown timer back to Day 0.',
              color: 'emerald',
            },
            {
              day: 'Day 15',
              title: 'Level 1 Email Reminder',
              desc: 'Friendly email check-in asking owner to verify status by logging in.',
              color: 'cyan',
            },
            {
              day: 'Day 30',
              title: 'Level 2 Follow-Up Warning',
              desc: 'Second email notification sent to vault owner to confirm activity.',
              color: 'purple',
            },
            {
              day: 'Day 60',
              title: 'Level 3 Final Emergency Warning',
              desc: 'Urgent notification sent to owner and designated primary executor.',
              color: 'amber',
            },
            {
              day: 'Day 90',
              title: 'Protocol Release Triggered',
              desc: 'Inactivity protocol activates. Verified nominees receive OTP access to assigned vault categories.',
              color: 'rose',
            },
          ].map((stage, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#050b14] border border-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-base font-['Outfit']">{stage.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#050b14] text-slate-300 border border-slate-800">
                      {stage.day}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{stage.desc}</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
