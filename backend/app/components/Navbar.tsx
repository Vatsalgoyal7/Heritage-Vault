'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Users,
  Sparkles,
  Heart,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  LayoutDashboard,
  CreditCard,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useTheme, THEME_OPTIONS } from '../context/ThemeContext';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Encrypted Vault', href: '/vault', icon: Lock },
    { name: 'Nominees & Executor', href: '/nominees', icon: Users },
    { name: 'Emergency Access', href: '/emergency', icon: AlertTriangle, badge: 'Active' },
    { name: 'AI Will Generator', href: '/will-generator', icon: Sparkles },
    { name: 'Memory Capsules', href: '/memory-capsule', icon: Heart },
    { name: 'Family Portal (Nominees)', href: '/family-portal', icon: UserCheck },
    { name: 'Audit Trail', href: '/audit-log', icon: FileText },
    { name: 'Profile & Settings', href: '/profile', icon: Settings },
    { name: 'Pricing Plans', href: '/pricing', icon: CreditCard },
  ];

  return (
    <aside
      className="w-64 border-r p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] transition-colors duration-300"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="space-y-6">
        {/* Preparedness Score Banner */}
        <div
          className="p-4 rounded-2xl border shadow-lg"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--text-secondary)' }}>
              Legacy Preparedness
            </span>
            <span className="text-base font-extrabold font-['Outfit']" style={{ color: 'var(--accent)' }}>
              85%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden mb-2 border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <div
              className="h-full rounded-full w-[85%]"
              style={{ background: `linear-gradient(90deg, var(--accent), var(--accent2))` }}
            />
          </div>
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            3 Nominees verified • AES-256 Vault Active
          </p>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      color: 'var(--accent2)',
                      borderColor: 'rgba(245,158,11,0.3)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Settings className="w-4 h-4" />
          <span>Profile & Settings</span>
        </Link>
        <button
          onClick={() => {
            api.clearToken();
            localStorage.removeItem('heritage_user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left"
          style={{ color: '#f43f5e' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Vault</span>
        </button>
      </div>
    </aside>
  );
}

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('heritage_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    api.clearToken();
    localStorage.removeItem('heritage_user');
    window.location.href = '/login';
  };

  const name = user?.displayName || user?.name || user?.email?.split('@')[0] || 'Vault Owner';
  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Encrypted Vault', href: '/vault', icon: Lock },
    { name: 'Nominees & Executor', href: '/nominees', icon: Users },
    { name: 'Emergency Access', href: '/emergency', icon: AlertTriangle, badge: 'Active' },
    { name: 'AI Will Generator', href: '/will-generator', icon: Sparkles },
    { name: 'Memory Capsules', href: '/memory-capsule', icon: Heart },
    { name: 'Family Portal', href: '/family-portal', icon: UserCheck },
    { name: 'Audit Trail', href: '/audit-log', icon: FileText },
    { name: 'Profile & Settings', href: '/profile', icon: Settings },
    { name: 'Pricing Plans', href: '/pricing', icon: CreditCard },
  ];

  return (
    <>
      <header
        className="h-16 border-b sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between backdrop-blur-md transition-colors duration-300"
        style={{ background: 'var(--nav-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border text-sm transition-colors"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl p-0.5 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, var(--accent), var(--accent2))` }}
            >
              <div className="w-full h-full rounded-[10px] flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <div>
              <span className="font-bold text-base md:text-lg font-['Outfit'] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Heritage Vault
              </span>
              <span className="block text-[8px] md:text-[9px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--accent)' }}>
                Cyber Legacy Protocol
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Quick Toggle Button */}
          <button
            onClick={toggleTheme}
            title="Switch Theme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:brightness-125 cursor-pointer"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
          >
            <span>{currentTheme?.icon}</span>
            <span className="hidden sm:inline font-['Outfit']">{currentTheme?.name}</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Inactivity Protocol: Active</span>
          </div>

          <div className="flex items-center gap-2 pl-2 md:pl-3 border-l" style={{ borderColor: 'var(--border-color)' }}>
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden xl:inline text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {name}
            </span>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-1 text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col pt-16 transition-all" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            <div className="p-4 rounded-2xl border mb-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Signed in as {name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'demo@example.com'}</p>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                      color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent2)', borderColor: 'rgba(245,158,11,0.3)' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t mt-4 space-y-2" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm border"
                style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Vault</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
