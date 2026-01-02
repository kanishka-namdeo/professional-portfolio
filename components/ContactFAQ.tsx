'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "Are you open to remote opportunities?",
    answer: "Yes! I've been working with distributed teams for years, so I'm fluent in Slack, Zoom, and the occasional 3 AM emergency call. I've learned that great product work doesn't require being in the same room—just the same wavelength.",
  },
  {
    question: "What's your biggest product failure, and what did you learn?",
    answer: "Early in my career, I spent 3 months building advanced analytics dashboards I was personally excited about. Launch day: 2 users enabled it. Zero ongoing usage. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build—20+ interviews minimum.",
  },
  {
    question: "How do you handle stakeholders who disagree with your priorities?",
    answer: "Disagreement is healthy—it's often where the best decisions emerge. I listen first, bring data second, and explicitly call out trade-offs. If we're fundamentally misaligned, I escalate rather than debate for weeks. I've had stakeholders resist features that later became our biggest wins. They became advocates because I listened, not because I convinced.",
  },
  {
    question: "Why should someone hire you?",
    answer: "Honestly? I ask a lot of questions. More than some people enjoy. But I've found that the right questions lead to better products—and fewer 3 AM emergency calls. I bridge engineering and customer needs because I've been on both sides. I bring technical depth with a user-centered mindset.",
  },
];

type TabType = 'contact' | 'faq';

export default function ContactFAQ() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="contact-title" className="section-title">
            {activeTab === 'contact' ? 'Get In Touch' : 'Frequently Asked Questions'}
          </h2>
          <p className="section-subtitle">
            {activeTab === 'contact'
              ? 'Let\'s discuss how we can work together'
              : 'Common questions about my work and expertise'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation animate-on-scroll">
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </button>
          <button
            className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content animate-on-scroll animate-delay-1">
          {/* Contact Tab */}
          <div className={`tab-panel ${activeTab === 'contact' ? 'active' : ''}`}>
            <div className="contact-grid">
              <div className="contact-info">
                <a href="mailto:kanishkanamdeo@hotmail.com" className="contact-item" aria-label="Send email to Kanishka">
                  <div className="contact-item-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="contact-item-content">
                    <h4>Email</h4>
                    <span>kanishkanamdeo@hotmail.com</span>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/kanishkanamdeo/" target="_blank" rel="noopener noreferrer" className="contact-item" aria-label="Connect on LinkedIn">
                  <div className="contact-item-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="contact-item-content">
                    <h4>LinkedIn</h4>
                    <span>Connect with me</span>
                  </div>
                </a>
                <div className="contact-item" aria-label="View location">
                  <div className="contact-item-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="contact-item-content">
                    <h4>Location</h4>
                    <span>Dubai, UAE</span>
                  </div>
                </div>
              </div>
              <div className="contact-cta">
                <h3>Building Something That Needs Better Product-Market Fit?</h3>
                <p>Whether you're scaling a B2B SaaS platform, leading a mobility product, or building AI-powered solutions, let's discuss how I can help accelerate your growth.</p>
                <div className="cta-buttons">
                  <a href="mailto:kanishkanamdeo@hotmail.com" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Me an Email
                  </a>
                </div>
                <div className="opportunity-preferences">
                  <h4>Currently Seeking</h4>
                  <p>Senior Product Manager & Product Leadership roles in B2B SaaS, Mobility, and AI/ML companies</p>
                  <p className="response-time">Response time: Within 48 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Tab */}
          <div className={`tab-panel ${activeTab === 'faq' ? 'active' : ''}`}>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div key={index} className={`faq-item ${openFAQIndex === index ? 'active' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openFAQIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {item.question}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" className="faq-chevron">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className="faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    style={{ maxHeight: openFAQIndex === index ? '500px' : '0' }}
                  >
                    <div className="faq-answer-content" id={`faq-question-${index}`}>
                      {item.answer.split('\n').map((line, lineIndex) => {
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <p key={lineIndex} className="faq-list-item">
                              {line.trim().substring(2)}
                            </p>
                          );
                        }
                        return <p key={lineIndex}>{line}</p>;
                      })}
                    </div>
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
