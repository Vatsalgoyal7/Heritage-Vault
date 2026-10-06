'use client';

import React, { useState } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import { Sparkles, Download, ShieldCheck, FileText, CheckCircle2, RefreshCw, Printer } from 'lucide-react';
import { api } from '@/lib/api';

export default function WillGeneratorPage() {
  const [residence, setResidence] = useState('New Delhi, India');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Please ensure property documents are transferred to Father, photographic memories to Mother, and business files to Legal Executor.'
  );
  const [loading, setLoading] = useState(false);
  const [generatedWill, setGeneratedWill] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.generateWill({ residence, assets: [] });
      setGeneratedWill(res.willText);
    } catch (err: any) {
      alert(err.message || 'Failed to generate Will');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!generatedWill) return;

    const element = document.createElement('a');
    const file = new Blob([generatedWill], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Heritage_Vault_Digital_Will_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    if (!generatedWill) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Heritage Vault - Digital Will & Testament</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #111; line-height: 1.6; }
            h1 { font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            pre { font-size: 13px; white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <h1>HERITAGE VAULT - LAST WILL AND TESTAMENT</h1>
          <pre>${generatedWill}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                AI Will & Testament Generator
              </h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Google Gemini AI compiles your encrypted assets, nominees, and jurisdiction legal templates into a legal digital will.
              </p>
            </div>

            {generatedWill && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Legal Copy</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-6 rounded-3xl border space-y-4 shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-bold text-base font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Jurisdiction & Clause Inputs</h3>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Legal Jurisdiction / Location</label>
                <input
                  type="text"
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Special Inheritance Instructions</label>
                <textarea
                  rows={4}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="p-4 rounded-xl border space-y-2 text-xs" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <span className="font-bold uppercase text-[10px] tracking-wider" style={{ color: 'var(--accent)' }}>Included Vault Inventory:</span>
                <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Verified Nominees: Father, Mother</li>
                  <li>• AES-256 Encrypted Assets: Property Deeds, Bank Accounts</li>
                  <li>• Inactivity Protocol: 90-Day Safety Switch</li>
                </ul>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{generatedWill ? 'Re-Generate Will Document' : 'Draft Will with Gemini AI'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-2 p-6 rounded-3xl border shadow-lg space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-bold text-base font-['Outfit'] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  Digital Will Preview & Legal Text
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                  {generatedWill ? 'Draft Generated' : 'Awaiting Generation'}
                </span>
              </div>

              {generatedWill ? (
                <div className="p-6 rounded-2xl border font-mono text-xs leading-relaxed overflow-y-auto max-h-[500px] whitespace-pre-wrap shadow-inner" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  {generatedWill}
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <FileText className="w-16 h-16 mx-auto" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Click &quot;Draft Will with Gemini AI&quot; to generate your digital inheritance deed.</p>
                  <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Your legal document will structure real estate, bank credentials, and digital assets into clear executor directives.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
