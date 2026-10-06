import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';

export const metadata: Metadata = {
  title: 'Heritage Vault — Secure Digital Legacy & Inheritance Platform',
  description:
    'Preserving your digital legacy for future generations. Encrypted vault for documents, passwords, memory capsules, AI digital wills, and Inactivity Safety Protocol automated inheritance.',
  keywords: [
    'Digital Legacy', 'Encrypted Vault', 'Inactivity Safety Protocol',
    'Digital Will Generator', 'Memory Capsule', 'Heritage Vault',
    'Digital Inheritance', 'Secure Storage', 'Asset Protection', 'Estate Planning',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cyber">
      <body className="antialiased selection:bg-emerald-500 selection:text-slate-950">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
