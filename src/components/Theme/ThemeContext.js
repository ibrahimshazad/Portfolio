import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Initialize theme before any component renders
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
    return initialTheme;
};

// Execute immediately
initializeTheme();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(initializeTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext); 