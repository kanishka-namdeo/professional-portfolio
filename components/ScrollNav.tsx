'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const navSections = [
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'products', label: 'Code', icon: '💻' },
  { id: 'about', label: 'About', icon: '👤' },
];

export default function ScrollNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [showActiveTooltip, setShowActiveTooltip] = useState(false);
  const prevSectionRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check document first (in case ThemeToggle set it), then localStorage
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

  // Also listen for theme changes on document (from ThemeToggle in top nav)
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

  const clearTooltipTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const offset = 150;
      if (sectionTop <= offset) {
        current = section.getAttribute('id') || '';
      }
    });
    
    if (current && current !== prevSectionRef.current) {
      prevSectionRef.current = current;
      setActiveSection(current);
      setShowActiveTooltip(true);
      
      clearTooltipTimeout();
      
      timeoutRef.current = setTimeout(() => {
        setShowActiveTooltip(false);
      }, 2000);
    }
  }, [clearTooltipTimeout]);

  useEffect(() => {
    let ticking = false;
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTooltipTimeout();
    };
  }, [handleScroll, clearTooltipTimeout]);

  const handleScrollTo = (sectionId: string) => {
    const target = document.querySelector(`#${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <nav className="scroll-nav" aria-label="Section navigation">
      <div className="scroll-nav-inner">
        <div 
          className="scroll-nav-item-wrapper scroll-nav-theme"
          onMouseEnter={() => setHoveredSection('theme')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <button
            className="scroll-nav-button scroll-nav-theme-button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onFocus={() => setHoveredSection('theme')}
            onBlur={() => setHoveredSection(null)}
          >
            <span className="scroll-nav-icon">
              {theme === 'light' ? <span className="scroll-nav-icon-emoji">🌙</span> : <span className="scroll-nav-icon-emoji">☀️</span>}
            </span>
          </button>
          <div 
            className={`scroll-nav-tooltip ${hoveredSection === 'theme' ? 'visible' : ''}`}
            role="tooltip"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </div>
        </div>

        {navSections.map((section) => (
          <div 
            key={section.id}
            className={`scroll-nav-item-wrapper ${activeSection === section.id ? 'active' : ''}`}
          >
            <button
              className="scroll-nav-button"
              onClick={() => handleScrollTo(section.id)}
              aria-label={`Scroll to ${section.label}`}
              aria-current={activeSection === section.id ? 'page' : undefined}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onFocus={() => setHoveredSection(section.id)}
              onBlur={() => setHoveredSection(null)}
            >
              <span className="scroll-nav-icon">{section.icon}</span>
            </button>
            <div 
              className={`scroll-nav-tooltip ${hoveredSection === section.id || (activeSection === section.id && showActiveTooltip) ? 'visible' : ''}`}
              role="tooltip"
            >
              {section.label}
            </div>
          </div>
        ))}
        <div 
          className="scroll-nav-item-wrapper scroll-nav-top"
          onMouseEnter={() => setHoveredSection('top')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <button
            className="scroll-nav-button scroll-nav-top-button"
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            onFocus={() => setHoveredSection('top')}
            onBlur={() => setHoveredSection(null)}
          >
            <span className="scroll-nav-icon">⬆️</span>
          </button>
          <div 
            className={`scroll-nav-tooltip ${hoveredSection === 'top' ? 'visible' : ''}`}
            role="tooltip"
          >
            Back to Top
          </div>
        </div>
      </div>
    </nav>
  );
}
