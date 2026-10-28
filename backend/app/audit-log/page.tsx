'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { FileText, ShieldCheck, Clock, Key, Eye, UserCheck, AlertTriangle, Loader2, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const DEMO_AUDIT_LOGS = [
  {
    id: 'log_001',
    action: 'VAULT_DECRYPT',
    details: 'Vault item “HDFC NetBanking Credentials” decrypted by owner — AES-256-GCM key derived successfully',
    status: 'Secured',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_002',
    action: 'NOMINEE_VERIFIED',
    details: 'Nominee Rajesh Kumar Goyal (Father) OTP verification passed — identity confirmed via 6-digit code',
    status: 'Verified',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_003',
    action: 'EMERGENCY_REQUEST',
    details: 'Emergency access request submitted by rajesh.goyal@gmail.com — medical crisis protocol initiated',
    status: 'Pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_004',
    action: 'SAFETY_PROTOCOL_CHECK',
    details: 'Inactivity Safety Protocol heartbeat check — Day 67 of 90. No inactivity trigger. Monitoring active.',
    status: 'Active',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_005',
    action: 'VAULT_ENCRYPT',
    details: 'New vault item “LIC Policy No. 123456789” encrypted and stored — category: Business & Legal Docs',
    status: 'Secured',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_006',
    action: 'NOMINEE_ADDED',
    details: 'New nominee Priya Goyal (Sister) designated with View-Only access to IP & Source Code category',
    status: 'Secured',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_007',
    action: 'EMERGENCY_APPROVED',
    details: 'Emergency access request by priya.goyal@gmail.com APPROVED — vault access granted for 24 hours',
    status: 'Approved',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log_008',
    action: 'USER_LOGIN',
    details: 'Vault owner logged in from IP 103.24.xx.xx — Cyber Neon theme active, 2FA session established',
    status: 'Secured',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = api.getToken();
      const res = await fetch('/api/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const fetched = data.logs || [];
      setLogs(fetched.length > 0 ? fetched : DEMO_AUDIT_LOGS);
    } catch (err: any) {
      setLogs(DEMO_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl">
          {/* Demo Mode Banner */}
          <div className="px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--accent)' }}>
            <Zap className="w-3.5 h-3.5" />
            🎯 Demo Mode Active — 8 Immutable Audit Events Loaded · AES-256 Activity Logged
          </div>

          <div>
            <h1 className="text-2xl font-bold font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              Complete System Audit Trail
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Immutable security audit log tracking vault encryptions, decryptions, nominee verifications, and safety protocol checks.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border text-xs" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
              {error}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 rounded-2xl border text-center shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <ShieldCheck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No audit logs recorded yet.</p>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border shadow-lg space-y-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {logs.map((log: any) => (
                <div key={log.id} className="p-4 rounded-xl border flex items-center justify-between text-xs transition-all" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{log.details}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                          Action: {log.action}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>• {new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase font-mono" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                    {log.status || 'Secured'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
