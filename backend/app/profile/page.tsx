'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '../components/Navbar';
import {
  User,
  Shield,
  CreditCard,
  LogOut,
  Palette,
  Check,
  Sparkles,
  Zap,
  Terminal,
  Sun,
  Flame,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useTheme, THEME_OPTIONS, ThemeMode } from '../context/ThemeContext';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appearance' | 'profile' | 'security' | 'billing'>('appearance');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('heritage_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    api.clearToken();
    localStorage.removeItem('heritage_user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--accent)' }} />
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading profile settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="text-center">
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Please login to view your vault security profile</p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="px-6 py-2.5 font-bold text-xs rounded-xl shadow-lg"
            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const name = user.displayName || user.name || user.email?.split('@')[0] || 'Vault Owner';

  return (
    <div className="min-h-screen flex flex-col grid-bg transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Profile & Settings</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Customize interactive themes (including Witch Mode), manage account credentials, security levels, and billing subscriptions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar: User Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-3xl border shadow-xl space-y-6 transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl p-0.5 shadow-xl mb-4 transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, var(--accent), var(--accent2))` }}>
                    <div className="w-full h-full rounded-[22px] flex items-center justify-center text-3xl font-black font-['Outfit']" style={{ background: 'var(--bg-primary)', color: 'var(--accent)' }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold font-['Outfit']" style={{ color: 'var(--text-primary)' }}>{name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                      ✓ Verified Account (Trust Score: 85%)
                    </span>
                  </div>
                </div>

                {/* Active Theme Highlight */}
                <div className="p-4 rounded-2xl border space-y-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    <span>Active Interface Theme</span>
                    <span className="text-lg">{THEME_OPTIONS.find((t) => t.id === theme)?.icon}</span>
                  </div>
                  <p className="text-sm font-black font-['Outfit']" style={{ color: 'var(--accent)' }}>
                    {THEME_OPTIONS.find((t) => t.id === theme)?.name}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {THEME_OPTIONS.find((t) => t.id === theme)?.badge}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold text-xs transition-all hover:brightness-125"
                    style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out Vault Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Settings Tabs */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border shadow-xl overflow-hidden transition-all" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {/* Tabs */}
                <div className="flex border-b flex-wrap" style={{ borderColor: 'var(--border-color)' }}>
                  {[
                    { id: 'appearance', label: 'Interactive Themes', icon: Palette },
                    { id: 'profile', label: 'Profile Details', icon: User },
                    { id: 'security', label: 'Security Controls', icon: Shield },
                    { id: 'billing', label: 'Subscription', icon: CreditCard },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-4 font-semibold text-xs transition-all cursor-pointer ${
                          isActive ? 'border-b-2 font-bold' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                          borderColor: isActive ? 'var(--accent)' : 'transparent',
                          background: isActive ? 'var(--bg-secondary)' : 'transparent',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* APPEARANCE / INTERACTIVE THEMES TAB */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold font-['Outfit'] mb-1" style={{ color: 'var(--text-primary)' }}>
                          Select User Interactive Theme
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Choose your preferred color palette and atmospheric mode. Changes apply immediately across the entire vault application.
                        </p>
                      </div>

                      {/* Theme Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {THEME_OPTIONS.map((tOption) => {
                          const isSelected = theme === tOption.id;
                          return (
                            <div
                              key={tOption.id}
                              onClick={() => setTheme(tOption.id)}
                              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                                isSelected ? 'ring-2 shadow-2xl' : 'hover:border-opacity-60'
                              }`}
                              style={{
                                background: 'var(--bg-secondary)',
                                borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                                boxShadow: isSelected ? `0 8px 30px -5px ${tOption.primaryColor}33` : 'none',
                              }}
                            >
                              {/* Background ambient glow */}
                              <div
                                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
                                style={{ background: tOption.primaryColor }}
                              />

                              {/* Card Top */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl p-2 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                                    {tOption.icon}
                                  </span>
                                  <div>
                                    <h4 className="font-bold text-sm font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                                      {tOption.name}
                                    </h4>
                                    <span
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono"
                                      style={{
                                        color: tOption.primaryColor,
                                        borderColor: `${tOption.primaryColor}55`,
                                        background: `${tOption.primaryColor}15`,
                                      }}
                                    >
                                      {tOption.badge}
                                    </span>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </div>
                                )}
                              </div>

                              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                                {tOption.description}
                              </p>

                              {/* Color Preview Swatch Bar */}
                              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Palette:</span>
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <div className="w-4 h-4 rounded-full border shadow-sm" style={{ background: tOption.primaryColor, borderColor: 'rgba(255,255,255,0.2)' }} title="Primary Color" />
                                  <div className="w-4 h-4 rounded-full border shadow-sm" style={{ background: tOption.secondaryColor, borderColor: 'rgba(255,255,255,0.2)' }} title="Secondary Color" />
                                </div>
                              </div>

                              {/* Action button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTheme(tOption.id);
                                }}
                                className="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                style={{
                                  background: isSelected ? 'var(--accent)' : 'var(--bg-primary)',
                                  color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                                }}
                              >
                                {isSelected ? 'Active Theme' : `Switch to ${tOption.name}`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PROFILE DETAILS TAB */}
                  {activeTab === 'profile' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
                        <input
                          type="text"
                          defaultValue={name}
                          className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none"
                          style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          disabled
                          className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none opacity-60 cursor-not-allowed"
                          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Vault Role & Access</label>
                        <input
                          type="text"
                          defaultValue="Primary Vault Owner (Admin Master Key)"
                          disabled
                          className="w-full rounded-xl px-4 py-2.5 text-xs border outline-none opacity-60 cursor-not-allowed"
                          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SECURITY CONTROLS TAB */}
                  {activeTab === 'security' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        <div>
                          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>AES-256-GCM Zero-Knowledge Encryption</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Secrets are encrypted before being saved to storage.</p>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                          Active
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        <div>
                          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>90-Day Inactivity Safety Switch</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Automated cron countdown to verify owner status.</p>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                          Monitored
                        </span>
                      </div>
                    </div>
                  )}

                  {/* BILLING TAB */}
                  {activeTab === 'billing' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-5 rounded-2xl border space-y-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm font-['Outfit']" style={{ color: 'var(--text-primary)' }}>Free Developer Vault Plan</h4>
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full border" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                            Current Plan
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Includes 500MB encrypted storage, unlimited nominees, and AI will generator.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}