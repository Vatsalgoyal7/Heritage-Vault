import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from './context/ThemeContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Heritage Vault — Secure Digital Legacy & Inheritance Platform',
  description:
    'Preserving your digital legacy for future generations. Encrypted vault for documents, passwords, memory capsules, AI digital wills, and Inactivity Safety Protocol automated inheritance.',
  keywords: [
    'Digital Legacy', 'Encrypted Vault', 'Inactivity Safety Protocol',
    'Digital Will Generator', 'Memory Capsule', 'Heritage Vault',
    'Digital Inheritance', 'Secure Storage', 'Asset Protection', 'Estate Planning',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Heritage Vault',
    startupImage: '/icons/icon-512x512.png',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cyber">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Heritage Vault" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.svg" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.svg" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
      </head>
      <body className="antialiased selection:bg-emerald-500 selection:text-slate-950">
        <ThemeProvider>
          {children}
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
