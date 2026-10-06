'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { AlertTriangle, Clock, CheckCircle2, XCircle, ShieldCheck, Mail, ArrowRight, Loader2, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function EmergencyPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = api.getToken();
      const res = await fetch('/api/emergency', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load emergency access requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    try {
      setSubmitting(true);
      const token = api.getToken();
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await loadRequests();
      setShowAddModal(false);
      setReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to trigger emergency request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const token = api.getToken();
      const res = await fetch('/api/emergency/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await loadRequests();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                Emergency Access Controls
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Time-locked crisis protocols. Nominees can submit emergency unlock requests with email notification warnings.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg border flex items-center justify-center gap-2 transition-all"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent2)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Simulate Nominee Access Request</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border text-xs" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
              {error}
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 rounded-2xl border text-center shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <ShieldCheck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No active emergency requests. Vault monitoring protocol active.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl border space-y-4 shadow-lg transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Emergency Request</h3>
                      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Submitted by: {r.requestedBy}</p>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase font-mono"
                      style={{
                        background: r.status === 'APPROVED' ? 'rgba(16,185,129,0.1)' : r.status === 'REJECTED' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: r.status === 'APPROVED' ? 'var(--accent)' : r.status === 'REJECTED' ? '#f43f5e' : 'var(--accent2)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border text-xs space-y-1" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <span className="font-bold text-[10px] uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Reason:</span>
                    <p style={{ color: 'var(--text-primary)' }}>{r.reason}</p>
                  </div>

                  {r.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(r.id, 'reject')}
                        className="flex-1 py-2 rounded-xl text-xs font-bold border"
                        style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => handleApprove(r.id, 'approve')}
                        className="flex-1 py-2 font-bold text-xs rounded-xl shadow-lg"
                        style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                      >
                        Approve Emergency Access
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="max-w-md w-full p-6 rounded-3xl border space-y-4 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Simulate Emergency Access Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Crisis / Emergency Reason</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Hospitalization medical emergency — urgent property deed access needed."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs border"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Crisis Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
