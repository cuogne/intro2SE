import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "app_theme";

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme): void => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
};

// Set theme + lưu localStorage
const setThemeUtil = (theme: Theme): Theme => {
    if (typeof window !== "undefined") {
        localStorage.setItem(KEY, theme);
    }

    applyTheme(theme);
    return theme;
};

const isDark = (): boolean => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
};

// Toggle theme
const toggleThemeUtil = (): Theme => setThemeUtil(isDark() ? "light" : "dark");

interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    isDarkTheme: () => boolean;
    toggleTheme: () => Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

    // Sync theme state -> DOM + localStorage
    useEffect(() => {
        setThemeUtil(theme);
    }, [theme]);

    const value = useMemo<ThemeContextType>(
        () => ({
            theme,
            setTheme,
            isDarkTheme: () => theme === "dark",
            toggleTheme: () => {
                const nextTheme = toggleThemeUtil();
                setTheme(nextTheme);
                return nextTheme;
            },
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeProvider;
