"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface ThemeContextType {
    isDark: boolean;
    toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleDark: () => { },
});

const DARK_VARS: Record<string, string> = {
    "--color-primary": "#818cf8",
    "--color-on-primary": "#1e1b4b",
    "--color-primary-container": "#3730a3",
    "--color-on-primary-container": "#e0e7ff",
    "--color-secondary": "#94a3b8",
    "--color-on-secondary": "#0f172a",
    "--color-secondary-container": "#1e293b",
    "--color-on-secondary-container": "#e2e8f0",
    "--color-error": "#f87171",
    "--color-on-error": "#7f1d1d",
    "--color-error-container": "#991b1b",
    "--color-on-error-container": "#fee2e2",
    "--color-surface": "#0f172a",
    "--color-on-surface": "#f1f5f9",
    "--color-surface-variant": "#1e293b",
    "--color-on-surface-variant": "#94a3b8",
    "--color-surface-container-lowest": "#020617",
    "--color-surface-container-low": "#0f172a",
    "--color-surface-container": "#1e293b",
    "--color-surface-container-high": "#334155",
    "--color-surface-container-highest": "#475569",
    "--color-outline": "#334155",
    "--color-outline-variant": "#1e293b",
};

const LIGHT_VARS: Record<string, string> = {
    "--color-primary": "#4f46e5",
    "--color-on-primary": "#ffffff",
    "--color-primary-container": "#e0e7ff",
    "--color-on-primary-container": "#312e81",
    "--color-secondary": "#475569",
    "--color-on-secondary": "#ffffff",
    "--color-secondary-container": "#e2e8f0",
    "--color-on-secondary-container": "#0f172a",
    "--color-error": "#dc2626",
    "--color-on-error": "#ffffff",
    "--color-error-container": "#fee2e2",
    "--color-on-error-container": "#7f1d1d",
    "--color-surface": "#f8fafc",
    "--color-on-surface": "#0f172a",
    "--color-surface-variant": "#e2e8f0",
    "--color-on-surface-variant": "#475569",
    "--color-surface-container-lowest": "#ffffff",
    "--color-surface-container-low": "#f1f5f9",
    "--color-surface-container": "#e2e8f0",
    "--color-surface-container-high": "#cbd5e1",
    "--color-surface-container-highest": "#94a3b8",
    "--color-outline": "#94a3b8",
    "--color-outline-variant": "#e2e8f0",
};

function applyTheme(dark: boolean) {
    const root = document.documentElement;
    const vars = dark ? DARK_VARS : LIGHT_VARS;
    // Set as inline style (highest specificity — overrides @theme)
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const dark = stored ? stored === "dark" : prefersDark;
        setIsDark(dark);
        applyTheme(dark);
    }, []);

    const toggleDark = () => {
        setIsDark(prev => {
            const next = !prev;
            applyTheme(next);
            localStorage.setItem("theme", next ? "dark" : "light");
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
