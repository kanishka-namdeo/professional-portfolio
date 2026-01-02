'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const skillCategories = [
  {
    title: 'Product Management',
    icon: '📊',
    color: 'var(--accent-navy)',
    skills: ['Product Strategy', 'Roadmaps', 'User Research', 'PRDs', 'Agile/Scrum', 'User Stories', 'Epics', 'Market Analysis', 'Competitive Analysis', 'UX Flows'],
  },
  {
    title: 'Technical',
    icon: '💻',
    color: 'var(--accent-teal)',
    skills: ['MEAN Stack', 'Python', 'NLP/LLM', 'API Design', 'AngularJS', 'FastAPI', 'Huggingface', 'Microservices', 'System Design'],
  },
  {
    title: 'Domains',
    icon: '🎯',
    color: 'var(--accent-indigo)',
    skills: ['Mobility', 'SaaS', 'Robotics', 'Healthcare AI', 'Logistics', 'Wealth Tech', 'Enterprise'],
  },
  {
    title: 'Tools & Methods',
    icon: '⚙️',
    color: 'var(--accent-amber)',
    skills: ['Jira', 'Confluence', 'Figma', 'Mixpanel', 'Razorpay', 'ERP Systems', 'VoIP'],
  },
];

// Duplicate categories for infinite scroll effect (3 sets)
const infiniteCategories = [...skillCategories, ...skillCategories, ...skillCategories];

export default function Skills() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(skillCategories.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const cardWidth = 320 + 24; // card width + gap

  const scrollTo = useCallback((index: number, smooth: boolean = true) => {
    if (scrollRef.current) {
      scrollRef.current.style.transition = smooth && !isDragging ? 'transform 0.3s ease-out' : 'none';
      scrollRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  }, [cardWidth, isDragging]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current && isTransitioning) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);

      // Check if we've scrolled past the last set
      if (index >= skillCategories.length * 2) {
        setIsTransitioning(false);
        scrollTo(skillCategories.length, false);
        setCurrentIndex(skillCategories.length);
        setTimeout(() => setIsTransitioning(true), 50);
      }
      // Check if we've scrolled before the first set
      else if (index < skillCategories.length) {
        setIsTransitioning(false);
        scrollTo(skillCategories.length * 2, false);
        setCurrentIndex(skillCategories.length * 2);
        setTimeout(() => setIsTransitioning(true), 50);
      } else {
        setCurrentIndex(index);
      }
    }
  }, [cardWidth, isTransitioning, scrollTo]);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollTo(newIndex);
  };

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current ? parseFloat(scrollRef.current.style.transform.replace(/[^-?0-9.]/g, '') || String(currentIndex * cardWidth)) : 0);
  }, [cardWidth, currentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startX) * 1.5; // Reversed: drag left moves content right, drag right moves content left
    const newTransform = scrollLeft + walk;
    scrollRef.current.style.transition = 'none';
    scrollRef.current.style.transform = `translateX(${newTransform}px)`;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    setIsDragging(false);
    
    const x = e.clientX;
    const walk = x - startX; // Reversed direction
    const threshold = cardWidth * 0.3; // Drag threshold to change slide
    
    let newIndex = currentIndex;
    if (walk > threshold) {
      newIndex = currentIndex - 1; // Drag right goes to previous
    } else if (walk < -threshold) {
      newIndex = currentIndex + 1; // Drag left goes to next
    }
    
    setCurrentIndex(newIndex);
    scrollTo(newIndex);
  }, [isDragging, startX, currentIndex, cardWidth, scrollTo]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && scrollRef.current) {
      setIsDragging(false);
      scrollTo(currentIndex);
    }
  }, [isDragging, currentIndex, scrollTo]);

  useEffect(() => {
    // Initial position at the middle set
    scrollTo(skillCategories.length, false);
  }, [scrollTo]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <section id="skills" style={{ background: 'var(--color-bg)' }} aria-labelledby="skills-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="skills-title" className="section-title">Skills & Expertise</h2>
          <p className="section-subtitle">A comprehensive overview of my technical and professional skills</p>
        </div>
        
        <div className="skills-carousel">
          <button
            className="carousel-nav carousel-prev"
            onClick={() => scroll('left')}
            aria-label="Scroll to previous skill category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="skills-carousel-container">
            <div 
              className="skills-carousel-track" 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: isDragging ? 'grabbing' : 'grab', transform: `translateX(-${skillCategories.length * cardWidth}px)` }}
            >
              {infiniteCategories.map((category, index) => (
                <div 
                  key={index} 
                  className={`skill-category animate-on-scroll`}
                  style={{ transitionDelay: `${0.1 * (index % skillCategories.length + 1)}s` }}
                >
                  <div className="skill-category-header">
                    <div className="skill-category-icon" style={{ background: category.color, color: 'white' }}>
                      {category.icon}
                    </div>
                    <h3 className="skill-category-title">{category.title}</h3>
                  </div>
                  <div className="skill-tags">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            className="carousel-nav carousel-next"
            onClick={() => scroll('right')}
            aria-label="Scroll to next skill category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="carousel-dots" role="tablist" aria-label="Skill categories">
          {skillCategories.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex % skillCategories.length ? 'active' : ''}`}
              role="tab"
              aria-label={`Go to skill category ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
