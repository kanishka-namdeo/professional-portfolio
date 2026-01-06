'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Profile data
const profileData = {
  name: 'Kanishka Namdeo',
  role: 'Technical Product Manager',
  location: 'Dubai, UAE',
  experience: '8+ Years',
  avatarInitials: 'KN'
};

// Bio content
const bioContent = {
  paragraphs: [
    'I spent three years building autonomous drones—brilliant engineering that sometimes missed the mark because we weren\'t solving the right problems.',
    'That gap between "technically impressive" and "actually useful" became my obsession. Now I lead products that touch millions of users, combining technical depth with genuine user empathy.',
    'Currently at Noon, tackling fulfillment challenges at scale. Previously helped MoveInSync expand to 50+ cities across three countries.'
  ]
};

// Key metrics
const keyMetrics = [
  { value: '8x', label: 'ARR Growth' },
  { value: '50+', label: 'Cities Scaled' },
  { value: '30K+', label: 'Users Impacted' }
];

// Skills categories
const skillsData = [
  {
    title: 'Product Management',
    color: 'var(--accent-navy)',
    skills: ['Strategy', 'Roadmaps', 'User Research', 'PRDs', 'Agile/Scrum']
  },
  {
    title: 'Technical',
    color: 'var(--accent-teal)',
    skills: ['MEAN Stack', 'Python', 'NLP/LLM', 'API Design', 'FastAPI']
  },
  {
    title: 'Domains',
    color: 'var(--accent-indigo)',
    skills: ['Mobility', 'SaaS', 'Robotics', 'Healthcare AI', 'Logistics']
  },
  {
    title: 'Tools & Methods',
    color: 'var(--accent-amber)',
    skills: ['Jira', 'Confluence', 'Figma', 'Mixpanel', 'ERP Systems']
  }
];

// Credentials data
const credentialsData = [
  {
    icon: '🏆',
    title: 'Certified Scrum Product Owner',
    org: 'Scrum Alliance',
    date: 'November 2024'
  },
  {
    icon: '🎓',
    title: 'Bachelor of Engineering',
    org: 'UIT-RGPV • Mechanical Engineering',
    date: 'June 2015'
  },
  {
    icon: '🤖',
    title: 'Autonomous Mobile Robots',
    org: 'EDX',
    date: 'Robot Perception, Locomotion, Localization'
  },
  {
    icon: '🦾',
    title: 'Advanced Robot Programmer',
    org: 'KUKA College',
    date: 'KRL Programming, SIMPRO'
  }
];

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Credentials' }
] as const;

export default function About() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('overview');
  const [isVisible, setIsVisible] = useState(false);
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const profileSrc = `${basePath}/profile.jpg`;

  // Handle keyboard navigation for tabs
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }
    
    e.preventDefault();
    setActiveTab(tabs[newIndex].id);
  }, []);

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
    >
      <div className="container">
        
        {/* Section Header */}
        <header className="about-header animate-on-scroll">
          <h2 id="about-title" className="about-title">About Me</h2>
        </header>

        {/* Profile Header */}
        <div className={`about-profile-header ${isVisible ? 'visible' : ''}`}>
          <div className="profile-header-card">
            <div className="profile-avatar-container">
              <Image
                src={profileSrc}
                alt={`${profileData.name} - ${profileData.role}`}
                width={100}
                height={100}
                className="profile-avatar-image"
                priority
              />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{profileData.name}</h3>
              <p className="profile-role">{profileData.role}</p>
              <div className="profile-quick-facts">
                <span className="quick-fact">
                  <span className="quick-fact-icon">📍</span>
                  <span>{profileData.location}</span>
                </span>
                <span className="quick-fact">
                  <span className="quick-fact-icon">💼</span>
                  <span>{profileData.experience}</span>
                </span>
                <span className="quick-fact">
                  <span className="quick-fact-icon">🎓</span>
                  <span>B.E. Mechanical</span>
                </span>
              </div>
            </div>
            <div className="profile-cta">
              <a href="#contact" className="profile-contact-btn">
                <span>Get In Touch</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav 
          className={`about-tabs-nav ${isVisible ? 'visible' : ''}`}
          role="tablist"
          aria-label="About section tabs"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Panels */}
        <div className="about-tab-panels">
          
          {/* Overview Panel */}
          <div
            role="tabpanel"
            id="panel-overview"
            aria-labelledby="tab-overview"
            className={`tab-panel ${activeTab === 'overview' ? 'active' : ''}`}
            hidden={activeTab !== 'overview'}
          >
            <div className="overview-grid">
              <div className="overview-bio-card">
                <div className="bio-header">
                  <span className="bio-icon">👋</span>
                  <h4>Hey, I'm {profileData.name.split(' ')[0]}</h4>
                </div>
                {bioContent.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="bio-paragraph">{paragraph}</p>
                ))}
              </div>
              
              <div className="overview-metrics">
                {keyMetrics.map((metric, idx) => (
                  <div key={idx} className="metric-card">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Panel */}
          <div
            role="tabpanel"
            id="panel-skills"
            aria-labelledby="tab-skills"
            className={`tab-panel ${activeTab === 'skills' ? 'active' : ''}`}
            hidden={activeTab !== 'skills'}
          >
            <div className="skills-grid">
              {skillsData.map((category, idx) => (
                <div 
                  key={idx} 
                  className="skill-category-card"
                  style={{ '--skill-color': category.color } as React.CSSProperties}
                >
                  <div className="skill-category-header">
                    <span className="skill-indicator" />
                    <h4 className="skill-category-title">{category.title}</h4>
                  </div>
                  <div className="skill-tags">
                    {category.skills.map((skill, skillIdx) => (
                      <span key={skillIdx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials Panel */}
          <div
            role="tabpanel"
            id="panel-credentials"
            aria-labelledby="tab-credentials"
            className={`tab-panel ${activeTab === 'credentials' ? 'active' : ''}`}
            hidden={activeTab !== 'credentials'}
          >
            <div className="credentials-grid">
              {credentialsData.map((cred, idx) => (
                <div key={idx} className="credential-card">
                  <span className="credential-icon">{cred.icon}</span>
                  <div className="credential-content">
                    <h4 className="credential-title">{cred.title}</h4>
                    <p className="credential-org">{cred.org}</p>
                    <span className="credential-date">{cred.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
