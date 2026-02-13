'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '#experience', label: 'Experience' },
  { href: '#products', label: 'Code' },
  { href: '#about', label: 'About' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        try {
          const currentScrollY = window.scrollY;

          // Don't hide navigation when mobile menu is open
          if (!isOpen) {
            if (currentScrollY > lastScrollYRef.current && currentScrollY > 200) {
              setIsHidden(true);
            } else {
              setIsHidden(false);
            }
          }

          lastScrollYRef.current = currentScrollY;

          const sections = document.querySelectorAll('section[id]');
          let current = '';

          sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 200) {
              current = section.getAttribute('id') || '';
            }
          });

          setActiveSection(current);
        } catch (error) {
          console.error('Navigation scroll handler error:', error);
        } finally {
          rafRef.current = null;
        }
      });
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.nav-container') && !target.closest('.mobile-nav')) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isOpen, closeMenu]);

  const handleNavClick = (href: string) => {
    closeMenu();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Navigation target not found: ${href}`);
    }
  };

  return (
    <div className="nav-container">
      <nav className={`nav ${isHidden ? 'hidden' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#" className="nav-logo" aria-label="Go to homepage">
            <div className="nav-logo-icon">KN</div>
            <span>Kanishka Namdeo</span>
          </a>
          
          <ul className="nav-links-desktop">
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
          
          <div className="nav-cta-group">
            <ThemeToggle />
            
            <button
              className={`mobile-toggle ${isOpen ? 'active' : ''}`}
              id="mobileToggle"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobileNavLinks"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      
      <div className={`mobile-nav ${isOpen ? 'active' : ''}`} id="mobileNavLinks">
        <ul className="nav-links">
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
      </div>
      
      {isOpen && (
        <div 
          className="nav-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
