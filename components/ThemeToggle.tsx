'use client';

import { useState, useEffect, useCallback } from 'react';

// Icons - matching ScrollNav's emoji style
const SunIcon = () => <span className="theme-toggle-icon-emoji">☀️</span>;
const MoonIcon = () => <span className="theme-toggle-icon-emoji">🌙</span>;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or document attribute
  useEffect(() => {
    setMounted(true);
    // Check document first (in case ScrollNav set it), then localStorage
    const docTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = docTheme || savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    localStorage.setItem('theme', initialTheme);
  }, []);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as 'light' | 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for theme changes on document (from ScrollNav)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
          if (newTheme && newTheme !== theme) {
            setTheme(newTheme);
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  if (!mounted) {
    return <button className="theme-toggle" style={{ width: 40, height: 40 }} aria-hidden="true" />;
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}
