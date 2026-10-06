'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { Heart, Mail, Mic, Video, Plus, Clock, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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
      setCapsules(data.capsules || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load memory capsules');
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
      alert(err.message || 'Failed to seal memory capsule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 flex flex-col grid-bg">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-400" />
                Emotional Memory Capsules
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Record personal future letters, voice messages, or video capsules delivered to loved ones on custom dates or upon safety release.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Memory Capsule</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-400 text-xs">
              {error}
            </div>
          ) : capsules.length === 0 ? (
            <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-8 text-center">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">No memory capsules created yet. Write a personal letter for your family.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {capsules.map((c) => (
                <div key={c.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-rose-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                        {c.type === 'letter' && <Mail className="w-5 h-5" />}
                        {c.type === 'audio' && <Mic className="w-5 h-5" />}
                        {c.type === 'video' && <Video className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base font-['Outfit']">{c.title}</h3>
                        <p className="text-xs text-slate-400">Recipient: {c.recipient || 'Family'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {c.status || 'Sealed & Encrypted'}
                    </span>
                  </div>

                  <div className="bg-[#030712] p-3.5 rounded-xl border border-slate-900 font-mono text-xs text-slate-400 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      🔒 Sealed Capsule Message Payload:
                    </span>
                    <p className="truncate text-slate-500">AES256_GCM_CAPSULE_PAYLOAD::[SEALED_UNTIL_RELEASE]</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] text-emerald-400 font-medium">Release Condition: On Safety Release</span>
                    <span className="text-[10px] text-slate-500 font-mono">Sealed: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-md w-full p-6 rounded-3xl border border-rose-500/40 space-y-4">
            <h3 className="text-xl font-bold text-white font-['Outfit']">Seal Memory Capsule</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Capsule Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Letter for my Daughter's 18th Birthday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Recipient Name / Role</label>
                <input
                  type="text"
                  required
                  placeholder="Ananya Sharma (Daughter)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-[#050b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Capsule Format</label>
                <div className="flex gap-2">
                  {[
                    { id: 'letter', label: 'Letter / Text', icon: Mail },
                    { id: 'audio', label: 'Voice Note', icon: Mic },
                    { id: 'video', label: 'Video Note', icon: Video },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setType(item.id as any)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                          type === item.id
                            ? 'bg-rose-500 text-slate-950 border-rose-500 font-bold'
                            : 'bg-[#050b14] text-slate-400 border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Encrypted Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your private message or life advise here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#050b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-900 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Seal Capsule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
