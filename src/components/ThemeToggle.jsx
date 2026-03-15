import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = saved || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
        >
            <div className="theme-toggle__circle">
                {theme === 'light' ? (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="5" r="1.8" stroke="currentColor" stroke-width="1.2" />
                        <line x1="5" y1="0.5" x2="5" y2="2.2" stroke="currentColor" stroke-width="1" />
                        <line x1="5" y1="7.8" x2="5" y2="9.5" stroke="currentColor" stroke-width="1" />
                        <line x1="0.5" y1="5" x2="2.2" y2="5" stroke="currentColor" stroke-width="1" />
                        <line x1="7.8" y1="5" x2="9.5" y2="5" stroke="currentColor" stroke-width="1" />
                        <line x1="1.8" y1="1.8" x2="2.9" y2="2.9" stroke="currentColor" stroke-width="1" />
                        <line x1="7.1" y1="7.1" x2="8.2" y2="8.2" stroke="currentColor" stroke-width="1" />
                        <line x1="8.2" y1="1.8" x2="7.1" y2="2.9" stroke="currentColor" stroke-width="1" />
                        <line x1="1.8" y1="8.2" x2="2.9" y2="7.1" stroke="currentColor" stroke-width="1" />
                    </svg>
                ) : (
                    <svg width="8" height="8" viewBox="0 0 8 8">
                        <path d="M5.5 4A2.5 2.5 0 1 1 3.5 1.2 1.8 1.8 0 0 0 5.5 4z" fill="currentColor" />
                    </svg>
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
