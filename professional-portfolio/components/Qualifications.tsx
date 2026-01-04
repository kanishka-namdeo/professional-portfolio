'use client';

import { useEffect, useRef } from 'react';

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

export default function Qualifications() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <section id="qualifications" className="section-full-width" aria-labelledby="qualifications-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="qualifications-title" className="section-title">Qualifications</h2>
          <p className="section-subtitle">Foundational credentials and core competencies</p>
        </div>

        <div className="qualifications-grid">
          {/* Left Column: Education & Certifications */}
          <div className="qualifications-left animate-on-scroll">
            {/* Education */}
            <div className="credentials-group">
              <h3 className="credentials-group-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education
              </h3>
              <div className="education-cards">
                {education.map((edu, index) => (
                  <div key={index} className="foundation-card education-card">
                    <div className="foundation-icon education-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="foundation-content">
                      <h4 className="foundation-title">{edu.degree}</h4>
                      <p className="foundation-subtitle">{edu.school}</p>
                      <p className="foundation-date">{edu.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="credentials-group">
              <h3 className="credentials-group-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Certifications
              </h3>
              <div className="certifications-grid">
                {certifications.map((cert, index) => (
                  <div key={index} className="foundation-card cert-card">
                    <div className="cert-badge">{cert.icon}</div>
                    <div className="foundation-content">
                      <h4 className="foundation-title">{cert.title}</h4>
                      <p className="foundation-subtitle">{cert.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills Grid */}
          <div className="qualifications-right animate-on-scroll animate-delay-1">
            <h3 className="credentials-group-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Core Competencies
            </h3>
            <div className="skills-compact-grid">
              {skillCategories.map((category, index) => (
                <div
                  key={index}
                  className="skill-compact-card"
                  style={{ '--skill-color': category.color } as React.CSSProperties}
                >
                  <div className="skill-compact-header">
                    <span className="skill-compact-indicator"></span>
                    <h4 className="skill-compact-title">{category.title}</h4>
                  </div>
                  <div className="skill-compact-tags">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-compact-tag">
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
    </section>
  );
}
