'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { api, Nominee } from '@/lib/api';
import { Users, Plus, CheckCircle2, Clock, Mail, ShieldCheck, UserCheck, Trash2, KeyRound, Loader2 } from 'lucide-react';

export default function NomineesPage() {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('Father');
  const [phone, setPhone] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'download'>('download');
  const [adding, setAdding] = useState(false);

  const loadNominees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getNominees();
      setNominees(res.nominees || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load nominees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNominees();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setAdding(true);
      await api.addNominee({
        name,
        email,
        relation,
        phone: phone || undefined,
        accessLevel,
        assignedCategories: ['documents', 'credentials', 'evidence'],
      });

      await loadNominees();
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      alert(err.message || 'Failed to add nominee');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this nominee from your inheritance protocol?')) return;
    try {
      await api.deleteNominee(id);
      await loadNominees();
    } catch (err: any) {
      alert(err.message || 'Failed to delete nominee');
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
                <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                Nominees & Digital Executors
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Designate trusted family members and legal executors to receive specific encrypted vault categories upon safety trigger release.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Designate New Nominee</span>
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
          ) : nominees.length === 0 ? (
            <div className="p-8 rounded-2xl border text-center shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No nominees designated yet. Add family members to secure inheritance.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {nominees.map((n) => (
                <div key={n.id} className="p-6 rounded-2xl border space-y-4 relative shadow-lg transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-lg" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                        {n.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{n.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--accent2)', borderColor: 'var(--border-color)' }}>
                            {n.relation}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/10"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border text-xs space-y-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Assigned Vault Categories:</span>
                      <span className="font-bold uppercase text-[10px] tracking-wider" style={{ color: 'var(--accent)' }}>
                        {n.accessLevel === 'download' ? 'Full Access' : 'View Only'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(n.assignedCategories || ['documents']).map((cat) => (
                        <span key={cat} className="px-2.5 py-1 border rounded-lg text-[10px] font-mono" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                          ✓ {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t text-xs" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--accent)' }}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[11px]">Verified Nominee (OTP Passed)</span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>Added: {new Date(n.createdAt).toLocaleDateString()}</span>
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
            <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Designate Digital Nominee</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rakesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="father@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Relation</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Child">Child</option>
                    <option value="Legal Executor">Legal Executor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Access Level</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as any)}
                    className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="download">View & Download</option>
                    <option value="view">View Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  disabled={adding}
                  className="flex-1 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Nominee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
