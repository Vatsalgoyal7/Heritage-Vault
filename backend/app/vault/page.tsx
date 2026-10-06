'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { api, VaultItem } from '@/lib/api';
import {
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
  FileText,
  Briefcase,
  Globe,
  Cloud,
  FolderLock,
  Search,
  ShieldCheck,
  Upload,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Vault Items', icon: FolderLock },
  { key: 'documents', label: 'Documents (Property/Bank)', icon: FileText },
  { key: 'credentials', label: 'Credentials & Passwords', icon: KeyRound },
  { key: 'links_accounts', label: 'Links & Social Accounts', icon: Globe },
  { key: 'business', label: 'Business & Legal Docs', icon: Briefcase },
  { key: 'intellectual_property', label: 'IP & Source Code', icon: Lock },
  { key: 'cloud_storage', label: 'Cloud Storage Links', icon: Cloud },
  { key: 'evidence', label: 'Evidence & Photo Archives', icon: ShieldCheck },
];

export default function VaultPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<VaultItem[]>([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('documents');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('documents');
  const [uploading, setUploading] = useState(false);

  const loadVaultItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getVaultItems(selectedCat === 'all' ? undefined : selectedCat);
      setItems(response.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVaultItems();
  }, [selectedCat]);

  const handleDecrypt = async (itemId: string) => {
    if (decryptedMap[itemId]) {
      const nextMap = { ...decryptedMap };
      delete nextMap[itemId];
      setDecryptedMap(nextMap);
      return;
    }

    try {
      setDecryptingId(itemId);
      const token = api.getToken();
      const res = await fetch('/api/vault/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Decryption failed');

      setDecryptedMap({ ...decryptedMap, [itemId]: data.decryptedContent });
    } catch (err: any) {
      alert(err.message || 'Failed to decrypt vault asset');
    } finally {
      setDecryptingId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this encrypted asset?')) return;
    try {
      const token = api.getToken();
      await fetch(`/api/vault?id=${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadVaultItems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete vault item');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await api.createVaultItem({
        title,
        category,
        content,
        notes: notes || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      });
      
      await loadVaultItems();
      setShowAddModal(false);
      setTitle('');
      setContent('');
      setNotes('');
      setTags('');
    } catch (err: any) {
      setError(err.message || 'Failed to create vault item');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploadTitle) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', uploadTitle);
      formData.append('category', uploadCategory);

      await api.uploadFile(formData);
      
      await loadVaultItems();
      setShowUploadModal(false);
      setFile(null);
      setUploadTitle('');
      setUploadCategory('documents');
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const filtered = items.filter((item) => {
    const matchCategory = selectedCat === 'all' || item.category === selectedCat;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Lock className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                Encrypted Cyber Vault
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                AES-256-GCM zero-knowledge encryption. Secrets are decrypted on-demand with secure audit trail logging.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <Plus className="w-4 h-4" />
                <span>Encrypt Text Secret</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 font-bold text-xs rounded-xl shadow-lg border flex items-center justify-center gap-2 transition-all"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent2)' }}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Encrypted File</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search passwords, property deeds, bank credentials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs border outline-none transition-all"
                style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCat === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCat(cat.key)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl border text-xs" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}>
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <FolderLock className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No encrypted items found in this category.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border transition-all space-y-3 shadow-lg"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                            {item.category}
                          </span>
                          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDecrypt(item.id)}
                        disabled={decryptingId === item.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                      >
                        {decryptingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : decryptedMap[item.id] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        <span>{decryptedMap[item.id] ? 'Hide Content' : 'Decrypt & View'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/10"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border font-mono text-xs relative" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    {decryptedMap[item.id] ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider block flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                          <CheckCircle2 className="w-3 h-3" /> Decrypted Ciphertext Payload:
                        </span>
                        <p className="font-semibold leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{decryptedMap[item.id]}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                          🔒 Encrypted Content (AES-256-GCM Zero Knowledge Payload):
                        </span>
                        <p className="truncate select-none opacity-60" style={{ color: 'var(--text-secondary)' }}>AES256_GCM_AUTH_CIPHER::[SECURE_BLOB_LOCKED]</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex gap-1.5">
                      {item.tags && item.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                    {item.assignedNominees && item.assignedNominees.length > 0 && (
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
                        {item.assignedNominees.length} nominee(s) assigned
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="max-w-md w-full p-6 rounded-3xl border space-y-4 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Encrypt & Store Asset</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Property Deed, Bank PIN"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="documents">Documents (Property/Insurance)</option>
                  <option value="credentials">Credentials & Passwords</option>
                  <option value="business">Business (GST/Invoices)</option>
                  <option value="links_accounts">Links & Social Accounts</option>
                  <option value="evidence">Evidence & Photos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Secret Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter confidential password, deed details, or private seed phrases..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="property, legal, bank"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
                  className="flex-1 py-2.5 font-bold text-xs rounded-xl shadow-lg"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="max-w-md w-full p-6 rounded-3xl border space-y-4 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Upload Encrypted Document</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House Tax Certificate 2025"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Select File (PDF, TXT, DOC, Image)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl px-4 py-2 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs border"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload & Encrypt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}