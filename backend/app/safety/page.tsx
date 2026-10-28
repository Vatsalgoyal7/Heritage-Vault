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
    <div className="min-h-screen grid-bg flex flex-col transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border" style={{ background: 'var(--bg-secondary)', color: 'var(--accent2)', borderColor: 'var(--border-color)' }}>
            AUTOMATED DEAD-MAN SWITCH PROTOCOL
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
            90-Day Inactivity Safety Protocol
          </h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
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
              title: 'Level 3 Crisis Pre-Alert',
              desc: 'Pre-alert notification sent to verified nominees to prepare for release protocol.',
              color: 'amber',
            },
            {
              day: 'Day 90',
              title: 'Estate Release Trigger',
              desc: 'Final safety switch releases encrypted assets to designated nominees.',
              color: 'rose',
            },
          ].map((s) => (
            <div key={s.day} className="p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{s.day}</span>
                <h3 className="text-lg font-bold font-['Outfit'] mt-1" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
