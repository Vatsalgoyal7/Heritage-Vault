'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar, Sidebar } from '../components/Navbar';
import {
  ShieldCheck,
  Lock,
  Timer,
  Users,
  KeyRound,
  Settings,
  CreditCard,
  AlertCircle,
  AlertTriangle,
  FileText,
  Briefcase,
  Globe,
  Cloud,
  FolderLock,
  Sparkles,
  UserCheck,
  Clock,
  Upload,
  Loader2,
  Zap,
  ArrowRight,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inactivitySimulated, setInactivitySimulated] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalVaultItems: 0,
    totalNominees: 0,
    storageUsed: 0,
    legacyScore: 35,
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('heritage_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const token = api.getToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Fetch vault items & nominees
      const [vaultRes, nomineeRes, logRes] = await Promise.all([
        api.getVaultItems().catch(() => ({ items: [] })),
        api.getNominees().catch(() => ({ nominees: [] })),
        fetch('/api/audit-logs', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ logs: [] })),
      ]);

      const itemsCount = vaultRes.items ? vaultRes.items.length : 0;
      const nomineesCount = nomineeRes.nominees ? nomineeRes.nominees.length : 0;
      const logs = logRes.logs || [];

      // Dynamic Legacy Score calculation
      let score = 25; // Base score
      if (itemsCount > 0) score += 25;
      if (itemsCount > 3) score += 10;
      if (nomineesCount > 0) score += 25;
      if (nomineesCount > 1) score += 15;
      score = Math.min(100, score);

      setStats({
        totalVaultItems: itemsCount,
        totalNominees: nomineesCount,
        storageUsed: Math.max(1, Math.round(itemsCount * 1.5)),
        legacyScore: score,
      });

      setRecentLogs(logs.slice(0, 4));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSimulateInactivity = () => {
    setInactivitySimulated(true);
    alert('🚨 INACTIVITY SAFETY PROTOCOL TRIGGERED (Day 90 Simulated)!\n\nAll verified nominees (Father, Mother) have been granted 24-hour emergency download access to their assigned vault categories.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Initializing Cyber Legacy Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl">
          {/* Welcome Header */}
          <div
            className="p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-xl"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20" style={{ background: 'var(--accent)' }} />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                  Welcome back, {user?.displayName || user?.name || user?.email?.split('@')[0] || 'Vault Owner'}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}
                >
                  AES-256 Active
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Your encrypted digital legacy is protected. Inactivity Safety Protocol monitoring is active.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSimulateInactivity}
                className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border"
                style={{
                  background: inactivitySimulated ? 'rgba(244,63,94,0.15)' : 'var(--bg-secondary)',
                  color: inactivitySimulated ? '#f43f5e' : 'var(--accent2)',
                  borderColor: inactivitySimulated ? 'rgba(244,63,94,0.4)' : 'var(--border-color)',
                }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{inactivitySimulated ? 'Protocol Released (Day 90 Active)' : 'Simulate Day 90 Trigger'}</span>
              </button>

              <Link
                href="/vault"
                className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all hover:brightness-110"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <Lock className="w-4 h-4" />
                <span>Open Vault</span>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-xs font-semibold">Vault Assets</span>
                <Lock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{stats.totalVaultItems}</p>
              <p className="text-[10px]" style={{ color: 'var(--accent)' }}>AES-256 Encrypted</p>
            </div>

            <div className="p-5 rounded-2xl border space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-xs font-semibold">Nominees</span>
                <Users className="w-4 h-4" style={{ color: 'var(--accent2)' }} />
              </div>
              <p className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{stats.totalNominees}</p>
              <p className="text-[10px]" style={{ color: 'var(--accent2)' }}>Verified Identity</p>
            </div>

            <div className="p-5 rounded-2xl border space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-xs font-semibold">Storage Used</span>
                <Cloud className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{stats.storageUsed} MB</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>500 MB Free Plan</p>
            </div>

            <div className="p-5 rounded-2xl border space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-xs font-semibold">Legacy Score</span>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent2)' }} />
              </div>
              <p className="text-2xl font-bold font-['Outfit']" style={{ color: 'var(--accent)' }}>{stats.legacyScore}%</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>High Preparedness</p>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/vault"
              className="p-6 rounded-2xl border space-y-3 group transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Encrypted Vault</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Store credentials, bank details, property deeds, and confidential notes.</p>
              <div className="flex items-center gap-1 text-xs font-semibold pt-1" style={{ color: 'var(--accent)' }}>
                <span>Manage Vault Assets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/nominees"
              className="p-6 rounded-2xl border space-y-3 group transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent2)' }}>
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Nominees & Executors</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Designate family members and legal executors for automated inheritance.</p>
              <div className="flex items-center gap-1 text-xs font-semibold pt-1" style={{ color: 'var(--accent2)' }}>
                <span>Manage Nominees</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/will-generator"
              className="p-6 rounded-2xl border space-y-3 group transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>AI Will Generator</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Draft legally formatted digital wills using Google Gemini AI and export to PDF.</p>
              <div className="flex items-center gap-1 text-xs font-semibold pt-1" style={{ color: 'var(--accent)' }}>
                <span>Generate Digital Will</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Recent System Audit Logs */}
          <div className="p-6 rounded-3xl border space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-bold text-base font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                Live Security Audit Log
              </h3>
              <Link href="/audit-log" className="text-xs hover:underline font-semibold" style={{ color: 'var(--accent)' }}>
                View All Activity →
              </Link>
            </div>

            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: 'var(--text-secondary)' }}>No recent security events logged.</p>
              ) : (
                recentLogs.map((log: any) => (
                  <div key={log.id} className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{log.details}</p>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase font-mono" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                      {log.status || 'Secured'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}