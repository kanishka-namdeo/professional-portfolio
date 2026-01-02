'use client';

import { useState, useEffect } from 'react';

const navSections = [
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'press', label: 'Press', icon: '📰' },
  { id: 'contact', label: 'Contact', icon: '📧' },
];

export default function ScrollNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="scroll-nav">
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
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <span className="scroll-nav-icon">{section.icon}</span>
            </button>
            <div 
              className={`scroll-nav-tooltip ${hoveredSection === section.id ? 'visible' : ''}`}
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
          >
            <span className="scroll-nav-icon">⬆️</span>
          </button>
          <div 
            className={`scroll-nav-tooltip ${hoveredSection === 'top' ? 'visible' : ''}`}
          >
            Top
          </div>
        </div>
      </div>
    </div>
  );
}
