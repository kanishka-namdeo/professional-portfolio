'use client';

import { useState, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import LinkedInIcon from './ui/LinkedInIcon';
import { X } from 'lucide-react';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const rafRef = useRef<number | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      try {
        const currentScrollY = latest;
        const sessionDismissed = sessionStorage.getItem('stickyCtaDismissed');

        if (!sessionDismissed && currentScrollY > 300) {
          setIsVisible(true);
        } else if (sessionDismissed) {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('StickyCTA scroll handler error:', error);
      } finally {
        rafRef.current = null;
      }
    });
  });

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('stickyCtaDismissed', 'true');
    setHasDismissed(true);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Transformable Sticky CTA */}
      <div 
        className={`sticky-cta-transformable ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Compact LinkedIn Icon */}
        <div className="cta-compact-icon">
          <LinkedInIcon size={24} />
        </div>

        {/* Expanded Content */}
        <div className="cta-expanded-view">
          <div className="cta-expanded-header">
            <span className="cta-text">
              <span className="cta-highlight">Hiring?</span> Let's connect.
            </span>
            <button onClick={handleDismiss} className="cta-dismiss" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
          <a
            href="https://www.linkedin.com/in/kanishkanamdeo/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            <LinkedInIcon size={18} />
            Say Hi
          </a>
        </div>
      </div>

      {/* Mobile FAB */}
      <a
        href="https://www.linkedin.com/in/kanishkanamdeo/"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-fab"
        aria-label="Connect on LinkedIn"
      >
        <LinkedInIcon size={24} />
      </a>
    </>
  );
}
