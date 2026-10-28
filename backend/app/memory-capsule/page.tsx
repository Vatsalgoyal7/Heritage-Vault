'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { Heart, Mail, Mic, Video, Plus, Clock, CheckCircle2, Lock, Loader2, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const DEMO_CAPSULES = [
  {
    id: 'demo_capsule_1',
    title: 'A Letter to My Family',
    type: 'letter',
    recipient: 'rajesh.goyal@gmail.com, sunita.goyal@gmail.com',
    message: 'Dear Papa and Maa,\n\nIf you are reading this, I want you to know how much I love you both. The property documents in the vault — Plot No. 14 in Sector 22 — please handle them carefully. The bank account details and LIC policies are all stored safely. Please consult Advocate Sharma in Noida before taking any legal step.\n\nYour son,\nVatsal',
    deliverOn: 'on_inactivity_protocol',
    createdAt: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'demo_capsule_2',
    title: 'Happy 25th Birthday Message',
    type: 'letter',
    recipient: 'priya.goyal@gmail.com',
    message: 'Priya,\n\nBy the time you read this, you will have turned 25. You were always the smartest one in our family. In the vault, I have kept all my project source codes and intellectual property documents — they belong to you. Build something great with them.\n\nWith love,\nBhaiya',
    deliverOn: 'on_inactivity_protocol',
    createdAt: new Date('2026-06-15').toISOString(),
  },
  {
    id: 'demo_capsule_3',
    title: 'Life Advice & Final Words',
    type: 'letter',
    recipient: 'All Nominees',
    message: 'To everyone I love,\n\nKeep the family together. The digital assets in Heritage Vault — the credentials, cloud accounts, and business documents — are yours to share and manage wisely. Do not rush decisions. Contact my legal executor Adv. R.K. Mehta (+91 98100 00001) for probate proceedings.\n\nAlways yours.',
    deliverOn: 'on_inactivity_protocol',
    createdAt: new Date('2026-07-20').toISOString(),
  },
];

export default function MemoryCapsulePage() {
  const [type, setType] = useState<'letter' | 'audio' | 'video'>('letter');
  const [capsules, setCapsules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCapsules = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = api.getToken();
      const res = await fetch('/api/memory-capsules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const fetched = data.capsules || [];
      setCapsules(fetched.length > 0 ? fetched : DEMO_CAPSULES);
    } catch (err: any) {
      setCapsules(DEMO_CAPSULES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      setSaving(true);
      const token = api.getToken();
      const res = await fetch('/api/memory-capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          type,
          recipient,
          message,
          deliverOn: 'on_inactivity_protocol',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await loadCapsules();
      setShowAddModal(false);
      setTitle('');
      setRecipient('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to create memory capsule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl">
          {/* Demo Mode Banner */}
          <div className="px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold" style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' }}>
            <Zap className="w-3.5 h-3.5" />
            🎯 Demo Mode Active — 3 Personal Memory Capsules Loaded · Locked Until 90-Day Trigger
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Heart className="w-6 h-6 text-rose-400" />
                Personal Memory Capsules
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Time-locked personal letters, audio recordings, and videos delivered to loved ones upon estate release.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg border flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Memory Capsule</span>
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
          ) : capsules.length === 0 ? (
            <div className="p-8 rounded-2xl border text-center shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3" />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No memory capsules created yet. Record personal notes for loved ones.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {capsules.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl border space-y-4 shadow-lg transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{c.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Recipient: {c.recipient || 'Designated Nominees'}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                      {c.type}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border font-mono text-xs space-y-1 shadow-inner" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--accent)' }}>🔒 Time-Locked Letter:</span>
                    <p className="whitespace-pre-wrap leading-relaxed">{c.message}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>Deliver On: 90-Day Release</span>
                    <span className="text-[10px] font-mono">Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="max-w-md w-full p-6 rounded-3xl border space-y-4 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Create Personal Memory Capsule</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Capsule Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Letter to My Son on 25th Birthday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Recipient Name / Email</label>
                <input
                  type="text"
                  placeholder="e.g. father@gmail.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Personal Message / Letter</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your personal message, advice, or private memories..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                  disabled={saving}
                  className="flex-1 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Lock Capsule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
