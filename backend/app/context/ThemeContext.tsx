'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'cyber' | 'witch' | 'light' | 'matrix';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  badge: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cyber',
    name: 'Cyber Neon',
    description: 'Emerald green & cyan cyberpunk interface with high-contrast security panels.',
    icon: '⚡',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    badge: 'Default Security',
  },
  {
    id: 'witch',
    name: 'Witch Mode',
    description: 'Mystical deep violet, glowing magenta & magic gold amber theme.',
    icon: '🔮',
    primaryColor: '#c084fc',
    secondaryColor: '#fbbf24',
    badge: 'Mystical Neon',
  },
  {
    id: 'matrix',
    name: 'Matrix Hacker',
    description: 'Classic hacker terminal with deep green matrix glow & monospace aesthetics.',
    icon: '💻',
    primaryColor: '#22c55e',
    secondaryColor: '#15803d',
    badge: 'Terminal Glow',
  },
  {
    id: 'light',
    name: 'Pristine Light',
    description: 'Clean modern daylight theme for maximum daytime readability.',
    icon: '☀️',
    primaryColor: '#059669',
    secondaryColor: '#0284c7',
    badge: 'Clean Day',
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyber',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('cyber');

  useEffect(() => {
    const saved = localStorage.getItem('hv_theme') as ThemeMode | null;
    if (saved && ['cyber', 'witch', 'light', 'matrix'].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hv_theme', theme);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const themes: ThemeMode[] = ['cyber', 'witch', 'matrix', 'light'];
      const nextIdx = (themes.indexOf(prev) + 1) % themes.length;
      return themes[nextIdx];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
