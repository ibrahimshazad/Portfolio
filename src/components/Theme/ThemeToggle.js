import React from 'react';
import { useTheme } from './ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    

    return (
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>
    );
}

export default ThemeToggle;