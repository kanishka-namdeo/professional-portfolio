'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Profile data
const profileData = {
  name: 'Kanishka Namdeo',
  role: 'Technical Product Manager',
  location: 'Dubai, UAE',
  experience: '9+ Years',
  tagline: 'I build digital products that people love to use — with clean code and thoughtful design.',
  avatarInitials: 'KN'
};

// Social proof data
const socialProof = {
  stats: [
    { value: '9+', label: 'Years Experience' },
    { value: '10+', label: 'Products Launched' },
    { value: '$2M+', label: 'Revenue Impact' }
  ],
  companies: ['Google', 'Amazon', 'Microsoft', 'Startup']
};

// Bio content - The Story
const bioContent = {
  paragraphs: [
    "I'm a technical product manager who loves building tools that make people's lives easier. With a background in engineering and a passion for clean design, I bridge the gap between technology and user experience.",
    "My journey spans from coding robots to leading product strategy. I believe the best products come from understanding the humans behind them."
  ]
};

// Journey timeline
const journeyItems = [
  { icon: '🎓', year: '2015', label: 'Started career in engineering' },
  { icon: '🤖', year: '2017', label: 'First product role' },
  { icon: '🚀', year: '2022', label: 'Led team of 8 engineers' },
  { icon: '📈', year: 'Now', label: 'Building impactful products' }
];

// FAQ categories
const faqCategories = [
  { id: 'working-with-me', label: 'Working With Me', icon: '🤝' },
  { id: 'my-approach', label: 'My Approach', icon: '💡' }
];

// FAQ data with category
const faqItems = [
  {
    category: 'working-with-me',
    icon: '🌍',
    question: 'Remote work capability',
    answer: "Absolutely — I've worked with distributed teams across multiple regions. I'm comfortable with async communication, regular video check-ins, and overlap across timezones. I use tools like Notion, Slack, and Jira to keep everything transparent and aligned."
  },
  {
    category: 'working-with-me',
    icon: '🤝',
    question: 'Handling disagreements',
    answer: "Disagreements are healthy when handled right. I focus on the problem, not the person. I ask questions to understand the other perspective, present data when possible, and I'm always willing to compromise to keep the project moving forward."
  },
  {
    category: 'my-approach',
    icon: '💔',
    question: 'Biggest failure and learnings',
    answer: "Early in my career, I spent 3 months building analytics dashboards I was personally excited about. Launch day: only 2 users enabled it. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build — 20+ interviews minimum."
  },
  {
    category: 'my-approach',
    icon: '⭐',
    question: 'Why hire me?',
    answer: "I bring both technical depth and product sensibility. I don't just ship features — I think about the user, the business, and long-term maintainability. I'm low-drama and high-impact, with a track record of scaling products across mobility, SaaS, and robotics domains."
  }
];

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState('working-with-me');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const profileSrc = `${basePath}/profile.jpg`;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqItems = faqItems.filter(item => item.category === activeFaqTab);

  const toggleTimeline = (index: number) => {
    setExpandedTimeline(expandedTimeline === index ? null : index);
  };

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

        {/* Tier 1: Identity & Hook */}
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
              <p className="profile-tagline">{profileData.tagline}</p>
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
            {/* CTA Section */}
            <div className="profile-cta-container">
              <a 
                href="mailto:kanishka.namdeo@gmail.com" 
                className="profile-cta-btn email-cta"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email Me</span>
              </a>
              <a 
                href="https://linkedin.com/in/kanishkanamdeo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="profile-cta-btn linkedin-cta"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={`about-split-container ${isVisible ? 'visible' : ''}`}>
          
          {/* Left Column: Story + Journey */}
          <div className="about-split-left">
            
            {/* Tier 2: The Story */}
            <div className="overview-bio-card">
              <div className="bio-header">
                <span className="bio-icon">👋</span>
                <h4>Hey, I'm {profileData.name.split(' ')[0]}</h4>
              </div>
              {bioContent.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="bio-paragraph">{paragraph}</p>
              ))}
            </div>

            {/* Journey Timeline */}
            <div className="experience-timeline">
              <div className="timeline-item">
                <div className="experience-dot"></div>
                <div 
                  className={`experience-card ${expandedTimeline === 0 ? 'expanded' : ''}`}
                  onClick={() => toggleTimeline(0)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTimeline(0)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedTimeline === 0}
                >
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">Started career</h4>
                      <span className="experience-company">Engineering</span>
                    </div>
                    <span className="experience-period">2015</span>
                  </div>
                  {expandedTimeline === 0 && (
                    <div className="timeline-expanded-content">
                      <p className="timeline-detail">Began journey in mechanical engineering, developing foundational skills in systems thinking, problem-solving, and cross-functional collaboration that would later inform my product management approach.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="timeline-item">
                <div className="experience-dot"></div>
                <div 
                  className={`experience-card ${expandedTimeline === 1 ? 'expanded' : ''}`}
                  onClick={() => toggleTimeline(1)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTimeline(1)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedTimeline === 1}
                >
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">First product role</h4>
                      <span className="experience-company">Transition to PM</span>
                    </div>
                    <span className="experience-period">2017</span>
                  </div>
                  {expandedTimeline === 1 && (
                    <div className="timeline-expanded-content">
                      <p className="timeline-detail">Pivoted from engineering to product management, combining technical depth with user-centric design thinking. Led my first product from concept through launch, learning the importance of validated learning and iterative development.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="timeline-item">
                <div className="experience-dot"></div>
                <div 
                  className={`experience-card ${expandedTimeline === 2 ? 'expanded' : ''}`}
                  onClick={() => toggleTimeline(2)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTimeline(2)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedTimeline === 2}
                >
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">Team leadership</h4>
                      <span className="experience-company">Led 8 engineers</span>
                    </div>
                    <span className="experience-period">2022</span>
                  </div>
                  {expandedTimeline === 2 && (
                    <div className="timeline-expanded-content">
                      <p className="timeline-detail">Advanced to senior product leadership, building and mentoring high-performing teams. Focused on creating environments where engineers, designers, and data scientists could do their best work while maintaining 95% team satisfaction scores.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="timeline-item current">
                <div className="experience-dot"></div>
                <div 
                  className={`experience-card ${expandedTimeline === 3 ? 'expanded' : ''}`}
                  onClick={() => toggleTimeline(3)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTimeline(3)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedTimeline === 3}
                >
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">Current focus</h4>
                      <span className="experience-company">Seeking next product opportunity</span>
                    </div>
                    <span className="experience-period">Now</span>
                  </div>
                  {expandedTimeline === 3 && (
                    <div className="timeline-expanded-content">
                      <p className="timeline-detail">Actively exploring senior and leadership product roles where I can drive meaningful impact. Open to opportunities in B2B SaaS, AI/ML platforms, or consumer tech. Let's connect if you're building something interesting.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column: FAQ + CTA */}
          <div className="about-split-right">
            
            {/* FAQ Section */}
            <div className="faq-section">
              <div className="faq-header">
                <h3 className="faq-title">FAQ</h3>
              </div>

              {/* FAQ Tab Navigation */}
              <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`faq-tab ${activeFaqTab === category.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFaqTab(category.id);
                      setExpandedFaq(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveFaqTab(category.id)}
                    role="tab"
                    aria-selected={activeFaqTab === category.id}
                    aria-controls={`faq-panel-${category.id}`}
                    tabIndex={0}
                  >
                    <span className="faq-tab-icon">{category.icon}</span>
                    <span className="faq-tab-label">{category.label}</span>
                  </button>
                ))}
              </div>

              {/* FAQ Tab Panels */}
              {faqCategories.map((category) => (
                <div
                  key={category.id}
                  id={`faq-panel-${category.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${category.id}`}
                  className={`faq-tab-panel ${activeFaqTab === category.id ? 'active' : ''}`}
                  hidden={activeFaqTab !== category.id}
                >
                  <div className="faq-list">
                    {faqItems
                      .filter(item => item.category === category.id)
                      .map((faq, idx) => (
                        <div 
                          key={idx} 
                          className={`faq-item-card ${expandedFaq === idx && activeFaqTab === category.id ? 'expanded' : ''}`}
                          onClick={() => {
                            const actualIndex = faqItems.filter(item => item.category === category.id).indexOf(faq);
                            setExpandedFaq(expandedFaq === actualIndex && activeFaqTab === category.id ? null : actualIndex);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const actualIndex = faqItems.filter(item => item.category === category.id).indexOf(faq);
                              setExpandedFaq(expandedFaq === actualIndex && activeFaqTab === category.id ? null : actualIndex);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-expanded={expandedFaq === idx && activeFaqTab === category.id}
                          aria-controls={`faq-answer-${category.id}-${idx}`}
                        >
                          <div className="faq-item-header">
                            <span className="faq-indicator" style={{ '--skill-color': 'var(--accent-purple)' } as React.CSSProperties}></span>
                            <h4 className="faq-question-title">{faq.question}</h4>
                            <span className="faq-toggle-icon">{expandedFaq === idx && activeFaqTab === category.id ? '−' : '+'}</span>
                          </div>
                          <div 
                            id={`faq-answer-${category.id}-${idx}`}
                            className={`faq-answer-text ${expandedFaq === idx && activeFaqTab === category.id ? 'visible' : ''}`}
                            aria-hidden={activeFaqTab !== category.id || expandedFaq !== idx}
                          >
                            {faq.answer}
                          </div>
                        </div>
                      ))}
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
