'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const navSections = [
  { id: 'products', label: 'Code', icon: '💻' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'contact', label: 'Contact', icon: '📧' },
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
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  // Clear tooltip timeout
  const clearTooltipTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Show scroll nav when user has scrolled past the hero section
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Track active section
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const offset = 150; // Offset for better detection
      if (sectionTop <= offset) {
        current = section.getAttribute('id') || '';
      }
    });
    
    // Only update if section changed
    if (current && current !== prevSectionRef.current) {
      prevSectionRef.current = current;
      setActiveSection(current);
      setShowActiveTooltip(true);
      
      // Clear any existing timeout
      clearTooltipTimeout();
      
      // Hide tooltip after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setShowActiveTooltip(false);
      }, 2000);
    }
  }, [clearTooltipTimeout]);

  useEffect(() => {
    // Throttle scroll events to improve performance
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
        {/* Theme Toggle Button */}
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
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
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
