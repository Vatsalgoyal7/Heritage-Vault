'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone, Monitor, Shield } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if already dismissed
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const iosDevice = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(iosDevice);

    if (iosDevice) {
      // Show iOS instructions after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Listen for Chrome/Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isInstalled || dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9999] max-w-sm mx-auto animate-slide-up"
      style={{ animationDuration: '0.4s' }}
    >
      <div
        className="relative p-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(124,58,237,0.15) 100%)',
          borderColor: 'var(--accent)',
          boxShadow: '0 0 30px rgba(124,58,237,0.3), 0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #f59e0b)' }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-bold text-sm font-['Outfit']" style={{ color: 'var(--text-primary)' }}>
                Install Heritage Vault
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {isIOS
                ? 'Tap the Share button then "Add to Home Screen" to install.'
                : 'Install as an app for faster access, offline use & a native feel.'}
            </p>

            {/* Features row */}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--accent)' }}>
                <Smartphone className="w-3 h-3" /> Mobile
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--accent)' }}>
                <Monitor className="w-3 h-3" /> Desktop
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--accent)' }}>
                <Shield className="w-3 h-3" /> Offline
              </span>
            </div>
          </div>
        </div>

        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9d5cf5)', color: 'white' }}
          >
            <Download className="w-4 h-4" />
            Install App — Free
          </button>
        )}

        {isIOS && (
          <div
            className="mt-3 p-3 rounded-xl text-xs space-y-1"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <p>1. Tap <strong style={{ color: 'var(--text-primary)' }}>Share</strong> button (↑) in Safari</p>
            <p>2. Scroll down → <strong style={{ color: 'var(--text-primary)' }}>"Add to Home Screen"</strong></p>
            <p>3. Tap <strong style={{ color: 'var(--accent)' }}>Add</strong> — done! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
