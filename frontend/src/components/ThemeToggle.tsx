import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const [dark, setDark] = useState<boolean>(theme === "dark");

    useEffect(() => {
        setDark(theme === "dark");
    }, [theme]);

    const handleClick = (): void => {
        toggleTheme();
    };

    return (
        <div className={className}>
            <div className="fixed bottom-3 right-3 z-50">
                <button
                    type="button"
                    className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                    onClick={handleClick}
                    aria-pressed={dark}
                    aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                >
                    <span className="block dark:hidden group-hover:rotate-45 transition-transform duration-500">
                        <Moon />
                    </span>
                    <span className="hidden dark:block group-hover:rotate-180 transition-transform duration-500">
                        <Sun />
                    </span>
                </button>
            </div>
        </div>
    );
}
