'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { FileText, ShieldCheck, Clock, Key, Eye, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load system audit trail');
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
