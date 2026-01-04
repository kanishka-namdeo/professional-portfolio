'use client';

import { useState } from 'react';

interface Credential {
  name: string;
  organization: string;
  date: string;
  icon: string;
  type: 'education' | 'certification';
}

const certifications: Omit<Credential, 'type'>[] = [
  {
    name: 'Certified Scrum Product Owner (CSPO)',
    organization: 'Scrum Alliance',
    date: 'November 2024',
    icon: '🏆',
  },
  {
    name: 'Autonomous Mobile Robots',
    organization: 'EDX',
    date: 'Robot Perception, Locomotion, Localization and Planning',
    icon: '🤖',
  },
  {
    name: 'Advanced Robot Programmer',
    organization: 'KUKA College',
    date: 'KRL Programming, SIMPRO Simulation',
    icon: '🦾',
  },
];

const education: Omit<Credential, 'type'>[] = [
  {
    name: 'Bachelor of Engineering',
    organization: 'UIT-RGPV',
    date: 'Mechanical Engineering • June 2015',
    icon: '🎓',
  },
];

// Combined credentials data for unified display
const credentials: Credential[] = [
  ...education.map(edu => ({ ...edu, type: 'education' as const })),
  ...certifications.map(cert => ({ ...cert, type: 'certification' as const })),
];

const skillCategories = [
  {
    title: 'Product Management',
    color: 'var(--accent-navy)',
    skills: ['Strategy', 'Roadmaps', 'User Research', 'PRDs', 'Agile/Scrum'],
  },
  {
    title: 'Technical',
    color: 'var(--accent-teal)',
    skills: ['MEAN Stack', 'Python', 'NLP/LLM', 'API Design', 'FastAPI'],
  },
  {
    title: 'Domains',
    color: 'var(--accent-indigo)',
    skills: ['Mobility', 'SaaS', 'Robotics', 'Healthcare AI', 'Logistics'],
  },
  {
    title: 'Tools & Methods',
    color: 'var(--accent-amber)',
    skills: ['Jira', 'Confluence', 'Figma', 'Mixpanel', 'ERP Systems'],
  },
];

type TabId = 'credentials' | 'skills';

export default function SkillsAndEducation() {
  const [activeTab, setActiveTab] = useState<TabId>('credentials');

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'credentials',
      label: 'Education & Certifications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="skills" className="section-full-width" aria-labelledby="skills-title" role="region" aria-label="Skills, Education, and Certifications">
      <div className="container">
        <header className="section-header">
          <h2 id="skills-title" className="section-title">Skills & Qualifications</h2>
          <p className="section-subtitle">Technical capabilities and core competencies</p>
        </header>

        {/* Tab Navigation */}
        <div className="skills-tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`skills-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Switch to ${tab.label} tab`}
              aria-pressed={activeTab === tab.id}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="skills-folder-container">
          <div className="skills-folder-body">
            {/* Credentials Tab Content */}
            <div className={`skills-folder-content ${activeTab === 'credentials' ? 'active' : ''}`}>
              <div className="credentials-folder-grid">
                {credentials.map((item, index) => (
                  <div
                    key={index}
                    className={`credential-folder-card ${item.type}`}
                  >
                    <div className="credential-folder-icon">
                      {item.type === 'education' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : (
                        <span className="credential-icon-emoji">{item.icon}</span>
                      )}
                    </div>
                    <div className="credential-folder-content">
                      <h4 className="credential-folder-title">{item.name}</h4>
                      <p className="credential-folder-org">{item.organization}</p>
                      <p className="credential-folder-date">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Tab Content */}
            <div className={`skills-folder-content ${activeTab === 'skills' ? 'active' : ''}`}>
              <div className="skills-folder-grid">
                {skillCategories.map((category, index) => (
                  <div
                    key={index}
                    className="skill-folder-card"
                    style={{ '--skill-color': category.color } as React.CSSProperties}
                  >
                    <div className="skill-folder-header">
                      <span className="skill-folder-indicator"></span>
                      <h4 className="skill-folder-title">{category.title}</h4>
                    </div>
                    <div className="skill-folder-tags">
                      {category.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-folder-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
