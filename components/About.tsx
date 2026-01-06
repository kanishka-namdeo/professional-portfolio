'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Experience timeline data
const experienceTimeline = [
  {
    role: 'Technical Product Manager',
    company: 'Noon',
    period: '2022 - Present',
    current: true,
    description: 'Leading product strategy for logistics and fulfillment solutions'
  },
  {
    role: 'Product Manager',
    company: 'Sagar Defence Systems',
    period: '2020 - 2022',
    current: false,
    description: 'Transitioned from engineering to product leadership'
  },
  {
    role: 'Robotics Engineer',
    company: 'Sagar Defence Systems',
    period: '2018 - 2020',
    current: false,
    description: 'Designed autonomous surface vehicles and drones'
  }
];

// Competencies with descriptions
const competencies = [
  { icon: '🔧', label: 'Technical', desc: 'Deep understanding of engineering and technology' },
  { icon: '📈', label: 'Growth', desc: 'Scaling products from zero to millions of users' },
  { icon: '🌍', label: 'Scale', desc: 'Building systems that handle global complexity' },
  { icon: '🎯', label: 'User Focus', desc: 'Translating user needs into product solutions' }
];

// Focus areas
const focusAreas = ['B2B SaaS', 'AI/ML', 'Startups', 'Mobility', 'Logistics'];

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
    <section 
      id="about" 
      className="section-full-width about-section" 
      aria-labelledby="about-title"
      role="article"
    >
      <div className="container">
        {/* Enhanced Hero Header */}
        <header className="about-hero-header animate-on-scroll">
          <h2 id="about-title" className="about-title">About Me</h2>
          <p className="about-subtitle">Bridging engineering excellence with user-centric product development</p>
        </header>

        {/* Main Grid Layout */}
        <div className={`about-grid-layout ${isVisible ? 'visible' : ''}`}>

          {/* Left Column - Main Content */}
          <div className="about-main-content">
            
            {/* Hero Quote Card */}
            <div className="about-quote-card animate-on-scroll">
              <blockquote className="about-quote-text">
                "I'm always trying to bridge the gap between what engineers build and what users actually need because I've been on both sides, and there's always more to learn."
              </blockquote>
            </div>

            {/* My Journey Card */}
            <div className="about-journey-card animate-on-scroll animate-delay-1">
              <div className="about-card-header">
                <span className="about-card-icon">🎯</span>
                <h3>My Journey</h3>
              </div>
              <div className="about-card-body">
                <p>
                  Started in <strong className="about-highlight-text">robotics engineering</strong> at <strong>Sagar Defence</strong>, designing autonomous surface vehicles and drones. I noticed brilliant technical work sometimes struggled not because of what we built, but <span className="about-highlight">how we communicated it</span>.
                </p>
                <p className="about-journey-continuation">
                  That insight sparked my pivot to product—learning to ask <em className="about-emphasis">why</em> before building what.
                </p>
                
                {/* Impact Metrics */}
                <div className="about-metrics">
                  <div className="about-metric">
                    <span className="about-metric-value">30K+</span>
                    <span className="about-metric-label">Users Reached</span>
                  </div>
                  <div className="about-metric">
                    <span className="about-metric-value">8x</span>
                    <span className="about-metric-label">ARR Growth</span>
                  </div>
                  <div className="about-metric">
                    <span className="about-metric-value">50+</span>
                    <span className="about-metric-label">Locations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="about-timeline-card animate-on-scroll animate-delay-2">
              <div className="about-card-header">
                <span className="about-card-icon">💼</span>
                <h3>Experience</h3>
              </div>
              <div className="about-timeline">
                {experienceTimeline.map((exp, index) => (
                  <div key={index} className={`about-timeline-item ${exp.current ? 'current' : ''}`}>
                    <div className="about-timeline-dot" />
                    <div className="about-timeline-content">
                      <div className="about-timeline-header">
                        <h4>{exp.role}</h4>
                        <span className={`about-timeline-period ${exp.current ? 'current' : ''}`}>
                          {exp.period}
                        </span>
                      </div>
                      <p className="about-timeline-company">{exp.company}</p>
                      <p className="about-timeline-desc">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced CTA Card */}
            <div className="about-cta-card animate-on-scroll animate-delay-3">
              <div className="about-cta-content">
                <div className="about-cta-text">
                  <h4>Let's Discuss Your Product Challenges</h4>
                  <p>Open to new opportunities and meaningful conversations about building better products.</p>
                </div>
                <a href="#contact" className="about-cta-button">
                  <span>Get In Touch</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <aside className="about-sidebar">
            
            {/* Profile Card */}
            <div className="about-profile-card animate-on-scroll animate-delay-1">
              <div className="about-profile-image">
                <div className="profile-image-wrapper">
                  <Image
                    src={profileSrc}
                    alt="Kanishka Namdeo - Technical Product Manager based in Dubai"
                    width={100}
                    height={100}
                    className="profile-image"
                    priority
                  />
                </div>
              </div>
              <div className="about-profile-info">
                <h4>Kanishka</h4>
                <p className="about-profile-title">Technical Product Manager</p>
                <div className="about-location-pill">
                  <span className="location-icon">📍</span>
                  <span>Dubai, UAE</span>
                </div>
              </div>
            </div>

            {/* Competencies Card */}
            <div className="about-competencies-card animate-on-scroll animate-delay-2">
              <div className="about-card-header compact">
                <span className="about-card-icon">⚡</span>
                <h3>Core Competencies</h3>
              </div>
              <div className="about-competencies-grid">
                {competencies.map((comp, index) => (
                  <div key={index} className="about-competency-item">
                    <span className="about-competency-icon">{comp.icon}</span>
                    <div className="about-competency-info">
                      <span className="about-competency-label">{comp.label}</span>
                      <span className="about-competency-desc">{comp.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas Card */}
            <div className="about-focus-card animate-on-scroll animate-delay-3">
              <div className="about-card-header compact">
                <span className="about-card-icon">🎯</span>
                <h3>Focus Areas</h3>
              </div>
              <div className="about-focus-tags">
                {focusAreas.map((area, index) => (
                  <span key={index} className="focus-tag">{area}</span>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </section>
  );
}
