'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, Lock, Sun, Zap } from 'lucide-react';
import { useTheme, THEME_OPTIONS } from '../context/ThemeContext';

export function PublicNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Security', href: '/security' },
    { name: 'Safety Protocol', href: '/safety' },
    { name: 'Add-ons', href: '/addons' },
    { name: 'About', href: '/about' },
    { name: 'Help', href: '/help' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const isLight = theme === 'light';

  return (
    <header
      className="h-20 border-b sticky top-0 z-50 px-6 transition-colors duration-300"
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--border-color)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
          >
            <div
              className="w-full h-full rounded-[10px] flex items-center justify-center"
              style={{ background: 'var(--bg-primary)' }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
              Heritage Vault
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--accent)' }}>
              Digital Legacy System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors duration-200"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--text-secondary)')}
              >
                {link.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle + Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle — All 4 Interactive Themes */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
            title="Switch Theme (Witch Mode, Cyber, Matrix, Light)"
          >
            <span>{THEME_OPTIONS.find((t) => t.id === theme)?.icon}</span>
            <span className="hidden sm:inline font-['Outfit']">{THEME_OPTIONS.find((t) => t.id === theme)?.name}</span>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login?mode=login"
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=register"
              className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:brightness-110"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                boxShadow: '0 4px 15px -3px var(--accent)',
              }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t p-6 space-y-4 shadow-2xl"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-semibold transition-colors"
                style={{ color: pathname === link.href ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)' }}>
            <Link
              href="/login?mode=login"
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-center border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=register"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
