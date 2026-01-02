'use client';

import { useState } from 'react';

const certifications = [
  {
    title: 'Certified Scrum Product Owner (CSPO)',
    org: 'Scrum Alliance',
    date: 'November 2024',
    icon: '🏆',
  },
  {
    title: 'Autonomous Mobile Robots',
    org: 'EDX',
    date: 'Robot Perception, Locomotion, Localization and Planning',
    icon: '🤖',
  },
  {
    title: 'Advanced Robot Programmer',
    org: 'KUKA College',
    date: 'KRL Programming, SIMPRO Simulation',
    icon: '🦾',
  },
];

const education = [
  {
    degree: 'Bachelor of Engineering',
    school: 'UIT-RGPV',
    date: 'Mechanical Engineering • June 2015',
  },
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

type TabId = 'skills' | 'education' | 'certifications';

const tabConfigs = {
  skills: {
    color: 'var(--accent-teal)',
    bgColor: '#ccfbf1',
    label: 'Skills',
  },
  education: {
    color: 'var(--accent-navy)',
    bgColor: '#dbeafe',
    label: 'Education',
  },
  certifications: {
    color: 'var(--accent-amber)',
    bgColor: '#fef3c7',
    label: 'Certifications',
  },
};

export default function SkillsAndEducation() {
  const [activeTab, setActiveTab] = useState<TabId>('education');

  const tabs: { id: TabId; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'education',
      label: 'Education',
      color: 'var(--accent-navy)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      id: 'certifications',
      label: 'Certifications',
      color: 'var(--accent-amber)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      color: 'var(--accent-teal)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-header">
          <h2 id="skills-title" className="section-title">Skills & Qualifications</h2>
          <p className="section-subtitle">Technical capabilities and core competencies</p>
        </div>

        {/* Archival Folder Container */}
        <div className="archival-folder">
          {/* Folder Tabs */}
          <div className="folder-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`folder-tab folder-tab-${tab.id} ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={`Switch to ${tab.label} tab`}
                aria-pressed={activeTab === tab.id}
              >
                <span className="folder-tab-icon" style={{ color: tab.color }}>{tab.icon}</span>
                <span style={{ color: activeTab === tab.id ? tab.color : 'inherit' }}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Folder Body */}
          <div className="folder-body">
            {/* Education Tab Content */}
            <div className={`folder-content ${activeTab === 'education' ? 'active' : ''}`}>
              <div className="education-folder-list">
                {education.map((edu, index) => (
                  <div key={index} className="education-folder-card">
                    <div className="education-folder-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="education-folder-content">
                      <h4 className="education-folder-degree">{edu.degree}</h4>
                      <p className="education-folder-school">{edu.school}</p>
                      <p className="education-folder-date">{edu.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Tab Content */}
            <div className={`folder-content ${activeTab === 'certifications' ? 'active' : ''}`}>
              <div className="certs-folder-grid">
                {certifications.map((cert, index) => (
                  <div key={index} className="cert-folder-card">
                    <div className="cert-folder-badge">{cert.icon}</div>
                    <div className="cert-folder-content">
                      <h4 className="cert-folder-title">{cert.title}</h4>
                      <p className="cert-folder-org">{cert.org}</p>
                      <p className="cert-folder-date">{cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Tab Content */}
            <div className={`folder-content ${activeTab === 'skills' ? 'active' : ''}`}>
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
