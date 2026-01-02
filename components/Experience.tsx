'use client';

import { useState, useEffect, useRef } from 'react';

type ResponsibilityCategory = 'Strategy & Leadership' | 'Product Growth' | 'Technical Collaboration' | 'Research & Innovation';

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

  let spanKey = 0;
  let result: React.ReactNode[] = [text];
  
  patterns.forEach(({ regex, className }) => {
    const newResult: React.ReactNode[] = [];
    result.forEach((part) => {
      if (typeof part === 'string') {
        const parts = part.split(regex);
        parts.forEach((p, i) => {
          if (p) {
            if (i % 2 === 1) {
              newResult.push(<span key={`${regex.source}-${spanKey++}`} className={className}>{p}</span>);
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
    summary: 'Led 0-to-1 AI-native wealth platform strategy—secured beta customer before prototype completion',
    responsibilities: [
      {
        category: 'Product Growth',
        items: [
          'Secured commitment of first beta customer prior to prototype completion, ensuring immediate feedback and validating market demand early.',
          'Conducted 20+ user interviews to identify critical industry pain points; translated insights into PRDs and wireframes for 0-to-1 product strategy.',
          'Built foundational engineering team of 4 to run technical experiments and execute product roadmap.',
        ],
      },
      {
        category: 'Strategy & Leadership',
        items: [
          'Architected LLM-agent framework for AI-driven investment suggestions and automated portfolio rebalancing, enabling hyper-contextualized client engagement at scale.',
          'Defined product vision and aligned stakeholders on go-to-market strategy for AI-native wealth platform.',
        ],
      },
    ],
    skills: ['User Interviews', 'PRDs', 'Wireframes', 'LLM-agent Framework', 'AI-driven Investment', 'Team Building', 'MVP Strategy'],
    achievements: ['✓ 0-to-1 Product Strategy', '✓ Beta Customer Pre-Launch', '✓ AI-Native Wealth Platform'],
  },
  {
    title: 'Product Consultant',
    company: 'Flipr Innovation Labs',
    url: 'https://flipr.ai/',
    date: 'Oct 2024 - Jan 2025',
    summary: 'Delivered high-volume video dispute MVP—50K daily orders, optimized cloud infrastructure',
    responsibilities: [
      {
        category: 'Technical Collaboration',
        items: [
          'Scoped core functionalities including automated tagging, retrieval, and storage optimization for high-volume processing handling ~50K daily orders.',
          'Integrated with OMS and support tools for seamless dispute resolution workflow with low-latency video retrieval.',
          'Optimized storage efficiency through compression and archival strategies, reducing cloud costs while maintaining performance.',
        ],
      },
      {
        category: 'Research & Innovation',
        items: [
          'Designed ML-driven video analysis pipeline to automate dispute classification and reduce manual review time by 60%.',
          'Implemented real-time streaming architecture for instant video playback across distributed cloud infrastructure.',
        ],
      },
    ],
    skills: ['MVP Delivery', 'Automated Tagging', 'Storage Optimization', 'OMS Integration', 'Cloud Architecture', 'ML Pipeline', 'Real-time Streaming'],
    achievements: ['✓ High-volume MVP Delivery', '✓ Optimized Cloud Costs', '✓ 50K Daily Orders Processed', '✓ 60% Manual Review Reduction'],
  },
  {
    title: 'Senior Product Manager',
    company: 'MoveInSync',
    url: 'https://moveinsync.com/',
    date: 'Apr 2022 - Present',
    summary: 'Scaled corporate mobility vertical to market leader—8x ARR growth, 30K+ users, 50+ locations',
    responsibilities: [
      {
        category: 'Product Growth',
        items: [
          'Onboarded 8 new enterprise clients in FY 2022-23, driving 7x product usage growth and 4x topline revenue across 25+ cities in India, Philippines, and South Africa.',
          'Increased app adoption by 20% through mobile app enhancements; VoIP calling and self-onboarding features achieved 70% active user adoption.',
          'Led team of 8 engineers; onboarded 15+ new clients adding 30,000+ unique monthly users while ensuring robust feature development and client enablement.',
        ],
      },
      {
        category: 'Technical Collaboration',
        items: [
          'Managed 5-8 person sprints using Scrum methodologies; increased productivity 2x through enhanced task prioritization and developer grooming.',
          'Rolled out first user payment integration with Razorpay; collaborated with 4+ teams to facilitate payments to 7+ vendor partners.',
          'Formulated unified APIs integrating 5+ fleet providers controlling 75% of vehicles; reduced implementation time by 20% through cohesive system integration.',
        ],
      },
    ],
    skills: ['UX Flows', 'Epics', 'User Stories', 'Product Roadmap', 'Market Research', 'Competitive Analysis', 'Trend Analysis', 'VoIP', 'ERP Integration', 'APIs', 'Razorpay', 'Scrum', 'UI/UX', 'System Design'],
    achievements: ['✓ 8x ARR Increase', '✓ 12x Product Usage Growth', '✓ 15+ New Clients', '✓ 30,000+ New Monthly Users', '✓ 50+ New Locations', '✓ 20% App Adoption Increase', '✓ 70% VoIP Feature Adoption', '✓ 20% Implementation Time Reduction'],
  },
  {
    title: 'Team Lead / Software Team Lead',
    company: 'TekIP Knowledge Consulting',
    url: 'https://www.tekip.com/',
    date: 'Dec 2020 - Apr 2022',
    summary: 'Launched NLP MVP improving patent analysis productivity by 10x—led 6-person Agile team',
    responsibilities: [
      {
        category: 'Strategy & Leadership',
        items: [
          'Managed 3 legacy and 2 ongoing MEAN stack projects; served as primary stakeholder contact point between business and development teams.',
          'Pitched new product verticals to C-Suite; secured budget allocation for stealth MVP through strategic presentations.',
          'Recruited and mentored in-house resources; developed approaches to adopt new technologies across the organization.',
        ],
      },
      {
        category: 'Technical Collaboration',
        items: [
          'Formulated software architecture and UX for 2 hybrid NLP solutions using MEAN Stack and Python microservices.',
          'Led Agile team of 6 developers; delivered 30+ features across 5 enterprise projects on time and within scope.',
        ],
      },
    ],
    skills: ['MEAN Stack', 'Software Architecture', 'UX', 'NLP', 'Python Microservices', 'LLM', 'Market Research', 'Agile', 'AngularJS', 'FastAPI', 'Huggingface'],
    achievements: ['✓ 10x Productivity Increase', '✓ 2 New Enterprise Projects', '✓ 30+ Features Delivered', '✓ Budget Allocation for MVP'],
  },
  {
    title: 'Product Manager',
    company: 'Intugine Technologies',
    url: 'https://www.intugine.com/',
    date: 'Jun 2019 - Dec 2020',
    summary: 'Built flagship multimodal logistics platform—improved workflow adoption, enhanced tracking accuracy',
    responsibilities: [
      {
        category: 'Product Growth',
        items: [
          'Improved platform adoption through workflow redesign; gathered client feedback to translate insights into actionable product improvements.',
          'Integrated external data sources via third-party partnerships; designed alerting systems for delays, exceptions, and critical events.',
        ],
      },
      {
        category: 'Strategy & Leadership',
        items: [
          'Led development of flagship multimodal logistics platform; collaborated with engineering, design, and operations to deliver scalable enterprise solutions.',
          'Conducted market research and competitive analysis; defined product requirements, user stories, and backlog to ensure timely feature delivery.',
          'Managed stakeholder communication; conducted product demos and aligned teams on vision and roadmap while defining KPIs and success metrics.',
        ],
      },
    ],
    skills: ['Market Research', 'Competitive Analysis', 'User Stories', 'Product Backlog', 'Dashboards', 'Reporting Tools', 'Analytics', 'UI/UX', 'KPIs', 'Multimodal Tracking', 'Alerting Systems'],
    achievements: ['✓ Improved Platform Adoption', '✓ Enhanced Tracking Accuracy', '✓ Enterprise Scale Features', '✓ Real-time Analytics Dashboard'],
  },
  {
    title: 'Product Manager',
    company: 'Medulla.AI',
    url: '',
    date: 'Jan 2019 - Jun 2019',
    summary: 'Defined AI-driven healthcare analytics vision—designed ML modules for anomaly detection',
    responsibilities: [
      {
        category: 'Strategy & Leadership',
        items: [
          'Defined product vision with founding team; shaped go-to-market strategy for healthcare AI platform.',
          'Analyzed competitor products and emerging medical AI trends; identified differentiation opportunities for market positioning.',
          'Coordinated with UI/UX designers to create intuitive dashboards; defined KPIs for model performance and product adoption.',
        ],
      },
      {
        category: 'Research & Innovation',
        items: [
          'Conducted extensive research on hospital workflows and diagnostic processes; designed ML-driven modules for anomaly detection and predictive analytics.',
          'Conducted user interviews with doctors and radiologists; designed workflows for automated report generation and clinical decision support.',
        ],
      },
    ],
    skills: ['User Stories', 'Acceptance Criteria', 'UI/UX', 'Predictive Analytics', 'Anomaly Detection', 'Wireframes', 'Prototypes', 'KPIs', 'Healthcare Data Standards'],
    achievements: ['✓ AI Healthcare Platform Vision', '✓ ML-driven Analytics Modules', '✓ Early Customer Validation', '✓ Healthcare Workflow Automation'],
  },
  {
    title: 'Robotics Engineer',
    company: 'Sagar Defence Engineering',
    url: 'https://www.sagardefence.com/',
    date: 'Jun 2017 - Dec 2018',
    summary: 'Developed autonomous USVs for defense—multi-sensor fusion, navigation algorithms, field trials',
    responsibilities: [
      {
        category: 'Technical Collaboration',
        items: [
          'Developed autonomous unmanned surface vehicles (USVs) for defense and industrial applications; integrated sensors, actuators, and embedded systems.',
          'Created ROS-based modules for sensor fusion, localization, and mission execution; developed control systems for stable maneuvering in marine environments.',
          'Integrated GPS, IMU, and marine radar data to improve navigation accuracy; supported teleoperation interface development for remote vehicle control.',
        ],
      },
      {
        category: 'Research & Innovation',
        items: [
          'Designed and implemented navigation algorithms for autonomous path planning and obstacle avoidance.',
          'Conducted field tests and validation trials with defense and industrial partners; designed simulation environments for mission scenario testing.',
        ],
      },
    ],
    skills: ['Navigation Algorithms', 'Autonomous Path Planning', 'Obstacle Avoidance', 'Sensor Fusion', 'ROS', 'GPS', 'IMU', 'Marine Radar', 'Simulation Environments', 'Teleoperation Interfaces', 'Power Management'],
    achievements: ['✓ Autonomous USV Development', '✓ Multi-Sensor Fusion', '✓ Successful Field Trials', '✓ Navigation Accuracy Improvement'],
  },
];

type TabType = 'all' | 'Product Growth' | 'Strategy & Leadership' | 'Technical Collaboration' | 'Research & Innovation';

const tabConfig: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All Experience' },
  { id: 'Product Growth', label: 'Product Growth' },
  { id: 'Strategy & Leadership', label: 'Strategy & Leadership' },
  { id: 'Technical Collaboration', label: 'Technical' },
  { id: 'Research & Innovation', label: 'Research' },
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const experienceRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);
  const [isExperienceVisible, setIsExperienceVisible] = useState(true);

  // Detect when Experience section is in view
  useEffect(() => {
    if (!experienceRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show menu when Experience section is intersecting (in view)
        setIsExperienceVisible(entry.isIntersecting);
      },
      {
        // Start detecting when the section enters the viewport
        rootMargin: '0px',
        threshold: 0
      }
    );

    observer.observe(experienceRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll to start of experience section when filter changes (not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (experienceRef.current) {
      const headerOffset = 140; // Account for fixed navigation (70px) + bottom sticky menu (70px)
      const elementPosition = experienceRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  return (
    <section id="experience" ref={experienceRef} style={{ background: 'var(--color-bg)' }} aria-labelledby="experience-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="experience-title" className="section-title">Experience</h2>
          <p className="section-subtitle">9+ years building and scaling products across mobility, SaaS, robotics, and AI</p>
        </div>

        {/* Tab Navigation - Sticky */}
        {/* Tab Navigation - Bottom Sticky (only visible when Experience section is in view) */}
        <div className={`experience-tab-navigation ${isExperienceVisible ? 'visible' : 'hidden'}`}>
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              className={`experience-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{getCategoryIcon(tab.id)}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="experience-tab-content animate-on-scroll animate-delay-1">
          {tabConfig.map((tab) => {
            // Filter experiences for this specific tab
            const tabExperiences = tab.id === 'all' 
              ? experiences 
              : experiences.filter(exp =>
                  exp.responsibilities.some(resp => resp.category === tab.id)
                );
            
            return (
              <div
                key={tab.id}
                className={`experience-tab-panel ${activeTab === tab.id ? 'active' : ''}`}
              >
                <div className="experience-timeline">
                  {tabExperiences.map((exp, index) => (
                    <div key={index} className={`experience-item animate-on-scroll ${index >= 3 ? 'animate-delay-1' : ''}`}>
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
                            {exp.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                          <div className="experience-achievements">
                            {exp.achievements.map((achievement, achIndex) => (
                              <span key={achIndex} className="achievement-badge">{achievement}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
