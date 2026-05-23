import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Mode = 'dark' | 'light';

export type ThemeColors = {
    ACCENT: string;
    ACCENT_SOFT: string;
    BG: string;
    SURFACE: string;
    CARD: string;
    BORDER: string;
    BORDER_STRONG: string;
    TEXT: string;
    TEXT_DIM: string;
    /** Text colour that always reads on the accent (e.g. on a green button). */
    ACCENT_ON: string;
    /** Pure heading colour. Light text in dark mode, near-black in light mode. */
    HEADING: string;
    mode: Mode;
};

const DARK: ThemeColors = {
    ACCENT: '#00FF88',
    ACCENT_SOFT: '#00CC77',
    BG: '#0B0F0D',
    SURFACE: '#111715',
    CARD: '#151B18',
    BORDER: 'rgba(0,255,136,0.08)',
    BORDER_STRONG: 'rgba(0,255,136,0.18)',
    TEXT: '#F5F7F6',
    TEXT_DIM: '#8C948F',
    ACCENT_ON: '#0B0F0D',
    HEADING: '#FFFFFF',
    mode: 'dark',
};

const LIGHT: ThemeColors = {
    // Darker green so it stays legible on white surfaces (badges, fine lines).
    ACCENT: '#00A957',
    ACCENT_SOFT: '#0E8C4B',
    BG: '#FFFFFF',
    SURFACE: '#F4F7F5',
    CARD: '#FFFFFF',
    BORDER: 'rgba(0,169,87,0.16)',
    BORDER_STRONG: 'rgba(0,169,87,0.32)',
    TEXT: '#0F1714',
    TEXT_DIM: '#5A6660',
    ACCENT_ON: '#FFFFFF',
    HEADING: '#0B1410',
    mode: 'light',
};

const ThemeCtx = createContext<{ theme: ThemeColors; toggle: () => void; setMode: (m: Mode) => void }>(
    { theme: DARK, toggle: () => { }, setMode: () => { } }
);

const STORAGE_KEY = 'trio-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>(() => {
        if (typeof window === 'undefined') return 'dark';
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'light' || saved === 'dark') return saved;
        } catch { /* ignore */ }
        return 'dark';
    });

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
        if (typeof document !== 'undefined') {
            document.documentElement.dataset.theme = mode;
            document.body.style.background = mode === 'light' ? LIGHT.BG : DARK.BG;
            document.body.style.color = mode === 'light' ? LIGHT.TEXT : DARK.TEXT;
        }
    }, [mode]);

    const value = useMemo(() => ({
        theme: mode === 'light' ? LIGHT : DARK,
        toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
        setMode,
    }), [mode]);

    return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeColors {
    return useContext(ThemeCtx).theme;
}

export function useThemeToggle(): { mode: Mode; toggle: () => void; setMode: (m: Mode) => void } {
    const ctx = useContext(ThemeCtx);
    return { mode: ctx.theme.mode, toggle: ctx.toggle, setMode: ctx.setMode };
}
