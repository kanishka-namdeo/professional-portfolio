'use client';

import { useState, useEffect, useCallback } from 'react';

const navSections = [
  { id: 'products-contributed', label: 'Products', icon: '📦' },
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
    
    setActiveSection(current);
  }, []);

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
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [handleScroll]);

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
              className={`scroll-nav-tooltip ${hoveredSection === section.id || activeSection === section.id ? 'visible' : ''}`}
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
