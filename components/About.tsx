'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const profileSrc = `${basePath}/profile.jpg`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-full-width" aria-labelledby="about-title" role="article" aria-description="Personal background and professional journey">
      <div className="container">
        <header className="section-header animate-on-scroll">
          <h2 id="about-title" className="section-title">About Me</h2>
          <p className="section-subtitle">Robotics Engineer Turned Product Manager</p>
        </header>

        {/* Option 1 + 5: Balanced Layout with Journey Card + CTA in Left Column */}
        <div className={`about-balanced-grid ${isVisible ? 'visible' : ''}`}>

          {/* Main Content Column (Left) */}
          <div className="about-main-col">

            {/* Hero Tagline */}
            <div className="about-hero-card animate-on-scroll">
              <div className="about-hero-icon">🚀</div>
              <blockquote className="about-hero-quote">
                "I'm always trying to bridge the gap between what engineers build and what users actually need because I've been on both sides, and there's always more to learn."
              </blockquote>
            </div>

            {/* My Journey Card - fills the void */}
            <div className="about-journey-card animate-on-scroll animate-delay-1">
              <div className="about-journey-header">
                <span className="about-journey-icon">🎯</span>
                <h3>My Journey</h3>
              </div>
              <div className="about-journey-content">
                <p>
                  Started in <strong>robotics engineering</strong> at <strong>Sagar Defence</strong>, designing autonomous surface vehicles and drones. I noticed brilliant technical work sometimes struggled not because of what we built, but <span className="about-highlight">how we communicated it</span>.
                </p>
                <p style={{ marginTop: 'var(--space-sm)' }}>
                  That insight sparked my pivot to product—learning to ask <em>why</em> before building what.
                </p>
                <div className="about-journey-metrics">
                  <div className="about-journey-metric">
                    <span className="metric-value">30K+</span>
                    <span className="metric-label">Users</span>
                  </div>
                  <div className="about-journey-metric">
                    <span className="metric-value">8x</span>
                    <span className="metric-label">ARR</span>
                  </div>
                  <div className="about-journey-metric">
                    <span className="metric-value">50+</span>
                    <span className="metric-label">Locations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card - NOW IN LEFT COLUMN */}
            <div className="about-cta-card animate-on-scroll animate-delay-3">
              <div className="about-cta-content">
                <div className="about-cta-text">
                  <h4>Let's Connect</h4>
                  <p>Open to discussing product challenges and sharing experiences.</p>
                </div>
                <a href="#contact" className="about-cta-button">
                  Get In Touch
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar Column (Right) - Now includes Competencies */}
          <div className="about-sidebar-col">

            {/* Profile Card with Photo */}
            <div className="about-profile-card animate-on-scroll animate-delay-1">
              <div className="about-profile-image">
                <div className="profile-image-wrapper">
                  <Image
                    src={profileSrc}
                    alt="Kanishka Namdeo"
                    width={100}
                    height={100}
                    className="profile-image"
                    priority
                  />
                </div>
              </div>
              <div className="about-profile-info">
                <h4>Kanishka</h4>
                <p>Technical Product Manager</p>
                <div className="about-location-pill">
                  <span className="location-icon">📍</span>
                  <span>Dubai, UAE</span>
                </div>
              </div>
            </div>

            {/* Competencies Grid - NOW IN SIDEBAR */}
            <div className="about-powers-grid animate-on-scroll animate-delay-2">
              <div className="about-power-card">
                <span className="about-power-icon">🔧</span>
                <span>Technical</span>
                <span className="about-power-icon">📈</span>
                <span>Growth</span>
              </div>

              <div className="about-power-card">
                <span className="about-power-icon">🌍</span>
                <span>Scale</span>
                <span className="about-power-icon">🎯</span>
                <span>User Focus</span>
              </div>
            </div>

            {/* Compact Focus Areas */}
            <div className="about-focus-card animate-on-scroll animate-delay-3">
              <h4>Focus Areas</h4>
              <div className="about-focus-tags">
                <span className="focus-tag">B2B SaaS</span>
                <span className="focus-tag">AI/ML</span>
                <span className="focus-tag">Startups</span>
                <span className="focus-tag">Mobility</span>
                <span className="focus-tag">Logistics</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
