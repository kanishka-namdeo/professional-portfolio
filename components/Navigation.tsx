'use client';

import { useState, useEffect, useCallback } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '#experience', label: 'Experience' },
  { href: '#products', label: 'Code' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Close menu on route change or scroll
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide nav when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);

      // Track active section
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 200) {
          current = section.getAttribute('id') || '';
        }
      });
      
      setActiveSection(current);
    };

    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.nav') && !target.closest('.nav-links')) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [lastScrollY, isOpen, closeMenu]);

  const handleNavClick = (href: string) => {
    closeMenu();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className={`nav ${isHidden ? 'hidden' : ''} ${isOpen ? 'nav-open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#" className="nav-logo" aria-label="Go to homepage">
            <div className="nav-logo-icon">KN</div>
            <span>Kanishka Namdeo</span>
          </a>
          
          <button
            className={`mobile-toggle ${isOpen ? 'active' : ''}`}
            id="mobileToggle"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="navLinks"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <ul className={`nav-links ${isOpen ? 'active' : ''}`} id="navLinks" role="menubar">
            {navLinks.map((link) => (
              <li key={link.href} role="none">
                <a
                  href={link.href}
                  className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="nav-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
