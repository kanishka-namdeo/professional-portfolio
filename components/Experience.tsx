'use client';

import { useState, useEffect, useRef } from 'react';

type ResponsibilityCategory =
  | 'Strategy & Leadership'
  | 'Product Growth'
  | 'Technical Collaboration'
  | 'Research & Innovation'
  | 'Product Strategy & MVP Execution'
  | 'MVP Execution & Technical Collaboration'
  | 'Product Growth & Strategy'
  | 'Technical Collaboration & New Product Development';
type ExpandedSkillsState = Record<number, boolean>;

interface CategorizedResponsibility {
  category: ResponsibilityCategory;
  items: string[];
}

interface Experience {
  title: string;
  company: string;
  url: string;
  date: string;
  summary: string;
  responsibilities: CategorizedResponsibility[];
  skills: string[];
  achievements: string[];
}

// Utility function to highlight important metrics and key phrases
const highlightText = (text: string): React.ReactNode => {
  // Patterns to highlight: numbers with K/+/x prefixes, percentages, key metrics
  const patterns = [
    { regex: /\b(\d+[Kkx\+]\s*(?:ARR|Growth|Users?|Locations?|Products?|Features?|Clients?|Projects?|Team|Orders|Daily|Minutes?)\b)/gi, className: 'highlight-text' },
    { regex: /\b(\d+%\s*(?:\w+(?:\s+\w+)*)?)\b/g, className: 'highlight-text' },
    { regex: /\b(\d+\+\s*(?:\w+(?:\s+\w+)*)?)\b/g, className: 'highlight-text' },
    { regex: /\b(\d+x\s*(?:\w+(?:\s+\w+)*)?)\b/g, className: 'highlight-text' },
    { regex: /\b(\d+\s*(?:Countries?|Enterprises?|Features?|Teams?|Developers?|Years?|Months?))\b/gi, className: 'highlight-text' },
    { regex: /\b(First|Beta|Pre-|MVP|0-to-1)\b/g, className: 'highlight-achievement' },
    { regex: /\b(AI|LLM|NLP|ML|ROS|API|OM[S,S]|SaaS|Growth|Strategy|Leadership)\b/g, className: 'highlight-skill' },
  ];

  let result: React.ReactNode[] = [text];

  patterns.forEach(({ regex, className }) => {
    const newResult: React.ReactNode[] = [];
    result.forEach((part) => {
      if (typeof part === 'string') {
        const parts = part.split(regex);
        parts.forEach((p, i) => {
          if (p) {
            if (i % 2 === 1) {
              newResult.push(<span key={`${regex.source}-${i}`} className={className}>{p}</span>);
            } else {
              newResult.push(p);
            }
          }
        });
      } else {
        newResult.push(part);
      }
    });
    result = newResult;
  });

  return <>{result}</>;
};

// Category icon components
const CategoryIconGrowth = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10M18 20V4M6 20v-4" />
  </svg>
);

const CategoryIconStrategy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CategoryIconTech = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const CategoryIconResearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CategoryIconAll = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Product Strategy & MVP Execution':
      return <CategoryIconStrategy />;
    case 'MVP Execution & Technical Collaboration':
      return <CategoryIconTech />;
    case 'Product Growth & Strategy':
      return <CategoryIconStrategy />;
    case 'Technical Collaboration & New Product Development':
      return <CategoryIconTech />;
    case 'Product Growth':
      return <CategoryIconGrowth />;
    case 'Strategy & Leadership':
      return <CategoryIconStrategy />;
    case 'Technical Collaboration':
      return <CategoryIconTech />;
    case 'Research & Innovation':
      return <CategoryIconResearch />;
    case 'all':
      return <CategoryIconAll />;
    default:
      return <CategoryIconGrowth />;
  }
};

const getCategoryColorClass = (category: string): string => {
  switch (category) {
    case 'Product Strategy & MVP Execution':
      return 'category-strategy';
    case 'MVP Execution & Technical Collaboration':
      return 'category-tech';
    case 'Product Growth & Strategy':
      return 'category-strategy';
    case 'Technical Collaboration & New Product Development':
      return 'category-tech';
    case 'Product Growth':
      return 'category-growth';
    case 'Strategy & Leadership':
      return 'category-strategy';
    case 'Technical Collaboration':
      return 'category-tech';
    case 'Research & Innovation':
      return 'category-research';
    default:
      return 'category-growth';
  }
};

const experiences: Experience[] = [
  {
    title: 'Senior Product Manager',
    company: 'Cognium',
    url: 'https://www.cogniuminc.com/',
    date: 'Jul 2025 - Oct 2025',
    summary: 'Cognium is building AI-native workflow optimization software for private banking and wealth management firms.',
    responsibilities: [
      {
        category: 'Product Strategy & MVP Execution',
        items: [
          "Conducted 20+ user interviews to identify workflow gaps, enabling a clear 0-to-1 product direction.",
          "Defined MVP scope and LLM-agent architecture, ensuring delivery of personalized investment insights.",
          "Secured the first beta customer before prototype completion, validating early market demand.",
          "Created PRDs and wireframes to align engineering and business teams, speeding execution.",
          "Hired and guided a 4-member engineering team, accelerating technical experiments and roadmap delivery."
        ],
      },
    ],
    skills: ["Product strategy", "User research", "MVP definition", "LLM-agent design", "Workflow architecture", "Team building", "Cross-functional alignment", "Wireframing", "Customer validation", "Early-stage product development"],
    achievements: ["Delivered the 0-to-1 product strategy for the platform", "Secured the first beta customer before prototype completion", "Designed the core system enabling personalized investment workflows", "Built and led the initial engineering team", "Established early feedback loops for rapid iteration"],
  },
  {
    title: 'Product Consultant',
    company: 'Flipr Innovation Labs',
    url: 'https://flipr.ai/',
    date: 'Oct 2024 - Jan 2025',
    summary: 'Flipr Innovation Labs specializes in tailored software development for e-commerce and logistics companies.',
    responsibilities: [
      {
        category: 'MVP Execution & Technical Collaboration',
        items: ["Scoped core MVP features for a video intelligence system, ensuring smooth client deployment.", "Integrated with OMS and support tools, improving dispute resolution speed.", "Designed storage optimization workflows, reducing cloud costs through compression and archival.", "Enabled high-volume processing of ~50K daily orders, ensuring system reliability.", "Coordinated with client teams to ensure adoption and seamless workflow integration."]
      },
    ],
    skills: ["MVP delivery", "Video intelligence systems", "Storage optimization", "Cloud cost reduction", "Low-latency workflow design", "OMS integration", "Automated tagging", "Retrieval system design", "Client onboarding", "High-volume system design"],
    achievements: ["Delivered a high-volume video intelligence MVP", "Reduced cloud costs through optimized storage and compression", "Built fast retrieval workflows for operational teams", "Integrated seamlessly with client OMS and support tools", "Launched automated tagging and retrieval features", "Enabled smooth adoption of the MVP by client teams"],
  },
  {
    title: 'Senior Product Manager',
    company: 'MoveInSync',
    url: 'https://moveinsync.com/',
    date: 'Apr 2022 - Oct 2024',
    summary: 'MoveInSync is the world’s largest transport-as-a-service provider for enterprises, simplifying employee commute and business travel management.',
    responsibilities: [
      {
        category: 'Product Growth & Strategy',
        items:
          ["Defined product vision and roadmap, driving 10x ARR growth and 15% usage increase.", "Expanded operations to 50+ new locations, enabling international market growth.", "Improved mobile app experience, increasing adoption by 20%.", "Rolled out invoicing, ERP integrations, and payments, adding 6+ clients to the upsell pipeline.", "Managed an 8-person sprint team, doubling productivity through better prioritization."]
      },
    ],
    skills: ["Product scaling", "Client onboarding", "International expansion", "Feature rollout", "API integrations", "Payments and invoicing", "User experience improvement", "Market research", "Product roadmap planning", "Cross-functional leadership"],
    achievements: ["Drove ~10x ARR growth and 15x product usage", "Onboarded 15+ enterprise clients and 60,000+ monthly users", "Expanded operations to 70+ new locations across 3 countries", "Launched features that improved user adoption and experience", "Built integrations that reduced implementation time by 40%", "Introduced payments and invoicing features to strengthen monetization"],
  },
  {
    title: 'Software Team Lead',
    company: 'TekIP Knowledge Consulting',
    url: 'https://www.tekip.com/',
    date: 'Dec 2020 - Apr 2022',
    summary: 'TekIP is a patent consulting firm specializing in SaaS solutions for IP search, analysis, and portfolio management.',
    responsibilities: [
      {
        category: 'Technical Collaboration & New Product Development',
        items: [
          "Led an Agile team of 6 developers across 5 enterprise projects, delivering 40+ features on time.", "Designed software architecture and UX for NLP-based solutions using MEAN stack and Python microservices.", "Launched an NLP product leveraging LLMs, improving patent analysis productivity by 10x.", "Mentored developers and improved team capability by introducing modern technologies."
        ],
      },
    ],
    skills: ["NLP product development", "Software architecture", "Agile delivery", "Team leadership", "Technical pitching", "UX design", "LLM integration", "Market research", "Hybrid system design", "Developer mentoring"],
    achievements: ["Launched an NLP MVP that improved analysis productivity by 10x", "Delivered 30+ features across multiple enterprise projects", "Secured budget approval for a new product initiative", "Added 2 enterprise projects through technical demos", "Designed architecture and UX for new product concepts", "Mentored developers and improved team capabilities"],
  },
  {
    title: 'Technical Consultant',
    company: 'Intugine Technologies',
    url: 'https://www.intugine.com/',
    date: 'Feb 2020 - Dec 2020',
    summary: 'Intugine is a leading SaaS platform specializing in logistics and supply chain visibility solutions. ',
    responsibilities: [
      {
        category: 'Product Growth',
        items: [
          "Led development of a multimodal logistics platform, delivering scalable solutions for enterprise clients.", "Defined product requirements and managed the backlog, ensuring timely delivery of high-impact features.", "Improved tracking accuracy across road, rail and air by enhancing system performance and data quality.", "Designed dashboards and alerting systems to provide real-time logistics visibility.", "Collaborated with clients and cross-functional teams to improve workflows and increase platform adoption."
        ],
      },
    ],
    skills: ["Logistics product development", "Workflow optimization", "Tracking systems", "Dashboard design", "Requirements definition", "Data accuracy improvement", "Cross-functional collaboration", "User experience design", "Operational analytics", "Product backlog management"],
    achievements: ['✓ Improved Platform Adoption', '✓ Enhanced Tracking Accuracy', '✓ Enterprise Scale Features', '✓ Real-time Analytics Dashboard'],
  },
  {
    title: 'Senior Technical Consultant',
    company: 'Medulla.AI',
    url: '',
    date: 'Apr 2020 - Aug 2020',
    summary: 'Medulla,AI develops custom Ai-driven solutions for healthcare and enterprise clients.',
    responsibilities: [
      {
        category: 'Technical Collaboration',
        items: [
          'Defined the vision for an AI‑based healthcare analytics product.',

          'Designed early ML features for prediction and anomaly detection.',

          'Created prototypes that were used by early pilot customers.',

          'Studied hospital workflows to identify automation opportunities.',
          'Built dashboards that supported clinical decision‑making.',

          'Ensured the product met healthcare data standards.'
        ],
      },
    ],
    skills: ["Healthcare product strategy", "Predictive analytics", "Anomaly detection", "Prototyping", "Workflow research", "Clinical dashboard design", "User interviews", "Compliance and standards", "Feature specification", "ML-driven product design"],
    achievements: ['✓ AI Healthcare Platform Vision', '✓ ML-driven Analytics Modules', '✓ Early Customer Validation', '✓ Healthcare Workflow Automation'],
  },
  {
    title: 'Co-founding member & Chief Technical Officer',
    company: 'Sagar Defence Engineering',
    url: 'https://www.sagardefence.com/',
    date: 'Jun 2016 - Jan 2020',
    summary: 'Sagar Defence develops unmanned aerial and maritime solutions for several defence and paramilitary agencies.',
    responsibilities: [
      {
        category: 'Technical Collaboration',
        items: [
          "Developed autonomous navigation algorithms for unmanned surface vehicles used in defense applications.", "Integrated sensors and embedded systems to improve navigation accuracy through multi-sensor fusion.", "Conducted field trials with defense and industrial partners to validate system performance.", "Built simulation environments to test mission scenarios before deployment.", "Collaborated with cross-functional teams to enhance power management and marine safety compliance."
        ],
      },
    ],
    skills: ["Autonomous navigation", "Sensor fusion", "Path planning", "Obstacle avoidance", "Simulation design", "Field testing", "Embedded systems integration", "Marine robotics", "Control systems", "Hardware-software integration"],
    achievements: ['✓ Autonomous USV Development', '✓ Multi-Sensor Fusion', '✓ Successful Field Trials', '✓ Navigation Accuracy Improvement'],
  },
];

// Extract unique companies for filter tabs
const uniqueCompanies = Array.from(new Set(experiences.map(exp => exp.company))).sort();

type TabType = 'all' | string;

const getTabConfig = () => [
  { id: 'all', label: 'All Companies' },
  ...uniqueCompanies.map(company => ({ id: company, label: company })),
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [expandedSkills, setExpandedSkills] = useState<ExpandedSkillsState>({});
  const experienceRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);
  const tabConfig = getTabConfig();

  const toggleSkillsExpand = (experienceIndex: number) => {
    setExpandedSkills(prev => ({
      ...prev,
      [experienceIndex]: !prev[experienceIndex]
    }));
  };

  // Scroll to start of experience section when filter changes (not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (experienceRef.current) {
      const headerOffset = 80; // Account for fixed navigation only
      const elementPosition = experienceRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  return (
    <section id="experience" ref={experienceRef} className="section-full-width" aria-labelledby="experience-title" role="region" aria-label="Work Experience">
      <div className="container">
        <header className="section-header animate-on-scroll">
          <h2 id="experience-title" className="section-title">Experience</h2>
          <p className="section-subtitle">9+ years building and scaling products across mobility, SaaS, robotics, and AI</p>
        </header>

        {/* Tab Navigation - Filter Bar */}
        <div className="experience-tab-navigation">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              className={`experience-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.id === 'all' && (
                <span className="tab-icon">
                  <CategoryIconAll />
                </span>
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="experience-tab-content animate-on-scroll animate-delay-1">
          {tabConfig.map((tab) => {
            // Filter experiences by company name
            const tabExperiences = tab.id === 'all'
              ? experiences
              : experiences.filter(exp => exp.company === tab.id);

            return (
              <div
                key={tab.id}
                className={`experience-tab-panel ${activeTab === tab.id ? 'active' : ''}`}
              >
                <div className="experience-timeline">
                  {tabExperiences.map((exp, index) => {
                    // Get the stable index of this experience in the full experiences array
                    const stableIndex = experiences.findIndex(e => e.company === exp.company && e.title === exp.title && e.date === exp.date);
                    const uniqueKey = `${activeTab}-${stableIndex}`;
                    return (
                      <div key={uniqueKey} className="experience-item">
                        <div className="experience-card">
                          <div className="experience-header">
                            <div>
                              <h3 className="experience-title">{exp.title}</h3>
                              <span className="experience-company">{exp.company}</span>
                              {exp.url && (
                                <a href={exp.url} target="_blank" rel="noopener noreferrer" className="experience-link" aria-label={`Visit ${exp.company} website`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Visit
                                </a>
                              )}
                            </div>
                            <span className="experience-date">{exp.date}</span>
                          </div>
                          <p className="experience-summary">{highlightText(exp.summary)}</p>
                          <div className="experience-description">
                            {exp.responsibilities.map((respCategory, catIndex) => (
                              <div key={catIndex} className={`responsibility-category ${getCategoryColorClass(respCategory.category)}`}>
                                <h4 className="category-title">
                                  <span className="category-icon">{getCategoryIcon(respCategory.category)}</span>
                                  {respCategory.category}
                                </h4>
                                <ul className="experience-responsibilities">
                                  {respCategory.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{highlightText(item)}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <div className="experience-skills">
                              {exp.skills.slice(0, expandedSkills[stableIndex] ? exp.skills.length : 4).map((skill, skillIndex) => (
                                <span key={skillIndex} className="skill-tag">{skill}</span>
                              ))}
                              {exp.skills.length > 4 && (
                                <button
                                  onClick={() => toggleSkillsExpand(stableIndex)}
                                  className="view-all-skills-button"
                                  aria-expanded={expandedSkills[stableIndex] || false}
                                  aria-label={expandedSkills[stableIndex] ? 'Show less skills' : `Show ${exp.skills.length - 4} more skills`}
                                >
                                  {expandedSkills[stableIndex] ? (
                                    <>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                      </svg>
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                      </svg>
                                      View all skills
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="experience-achievements">
                              {exp.achievements.map((achievement, achIndex) => (
                                <span key={achIndex} className="achievement-badge">{achievement}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
