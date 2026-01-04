'use client';

import { useState } from 'react';

type ResponsibilityCategory =
  | 'Strategy & Leadership'
  | 'Product Growth'
  | 'Technical Collaboration'
  | 'Research & Innovation'
  | 'Product Strategy & MVP Execution'
  | 'MVP Execution & Technical Collaboration'
  | 'Product Growth & Strategy'
  | 'Technical Collaboration & New Product Development';

interface CaseStudy {
  title: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics?: string[];
}

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
  caseStudy?: CaseStudy;
}

// Get company initial for logo
const getCompanyInitial = (company: string): string => {
  return company.charAt(0).toUpperCase();
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Product Strategy & MVP Execution':
    case 'Product Growth & Strategy':
    case 'Strategy & Leadership':
      return <CategoryIconStrategy />;
    case 'MVP Execution & Technical Collaboration':
    case 'Technical Collaboration & New Product Development':
    case 'Technical Collaboration':
      return <CategoryIconTech />;
    case 'Product Growth':
      return <CategoryIconGrowth />;
    case 'Research & Innovation':
      return <CategoryIconResearch />;
    default:
      return <CategoryIconGrowth />;
  }
};

const getCategoryColorClass = (category: string): string => {
  switch (category) {
    case 'Product Strategy & MVP Execution':
    case 'Product Growth & Strategy':
    case 'Strategy & Leadership':
      return 'category-strategy';
    case 'MVP Execution & Technical Collaboration':
    case 'Technical Collaboration & New Product Development':
    case 'Technical Collaboration':
      return 'category-tech';
    case 'Product Growth':
      return 'category-growth';
    case 'Research & Innovation':
      return 'category-research';
    default:
      return 'category-growth';
  }
};

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

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
    caseStudy: {
      title: "AI-Native Wealth Management Platform",
      challenge: "Private banking firms struggled with fragmented workflows and lack of personalized investment insights for high-net-worth clients.",
      solution: "Built an AI-native platform leveraging LLM-agents to automate personalized investment workflows, combining data aggregation with intelligent recommendations.",
      impact: "Enabled wealth managers to deliver tailored insights 10x faster while maintaining compliance and data security requirements.",
      metrics: ["20+ user interviews conducted", "First beta customer secured pre-launch", "4-person engineering team built from scratch"]
    }
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
    caseStudy: {
      title: "Video Intelligence for E-commerce",
      challenge: "E-commerce client needed automated video analysis to reduce manual review workload and improve dispute resolution accuracy.",
      solution: "Developed a video intelligence MVP with automated tagging, compression, and fast retrieval capabilities integrated with existing OMS.",
      impact: "Reduced dispute resolution time by 60% while processing 50K+ daily video uploads with optimized cloud infrastructure.",
      metrics: ["~50K daily orders processed", "60% reduction in dispute resolution time", "40% cloud cost reduction achieved"]
    }
  },
  {
    title: 'Senior Product Manager',
    company: 'MoveInSync',
    url: 'https://moveinsync.com/',
    date: 'Apr 2022 - Oct 2024',
    summary: "MoveInSync is the world's largest transport-as-a-service provider for enterprises, simplifying employee commute and business travel management.",
    responsibilities: [
      {
        category: 'Product Growth & Strategy',
        items:
          ["Defined product vision and roadmap, driving 10x ARR growth and 15% usage increase.", "Expanded operations to 50+ new locations, enabling international market growth.", "Improved mobile app experience, increasing adoption by 20%.", "Rolled out invoicing, ERP integrations, and payments, adding 6+ clients to the upsell pipeline.", "Managed an 8-person sprint team, doubling productivity through better prioritization."]
      },
    ],
    skills: ["Product scaling", "Client onboarding", "International expansion", "Feature rollout", "API integrations", "Payments and invoicing", "User experience improvement", "Market research", "Product roadmap planning", "Cross-functional leadership"],
    achievements: ["Drove ~10x ARR growth and 15x product usage", "Onboarded 15+ enterprise clients and 60,000+ monthly users", "Expanded operations to 70+ new locations across 3 countries", "Launched features that improved user adoption and experience", "Built integrations that reduced implementation time by 40%", "Introduced payments and invoicing features to strengthen monetization"],
    caseStudy: {
      title: "Enterprise Transport Platform Scale-Up",
      challenge: "Scaling a successful TaaS platform from regional to global presence while maintaining product quality and driving revenue growth.",
      solution: "Led strategic expansion to 70+ locations across 3 countries, launched mobile-first experience improvements, and built native payments/invoicing capabilities.",
      impact: "Achieved 10x ARR growth, expanded to 60,000+ monthly users, and established the platform as the market leader in enterprise transport management.",
      metrics: ["~10x ARR growth achieved", "60,000+ monthly active users", "70+ locations across 3 countries", "15+ enterprise clients onboarded"]
    }
  },
  {
    title: 'Software Team Lead',
    company: 'TekIP Knowledge Consulting',
    url: 'https://tekip.com/',
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
    caseStudy: {
      title: "AI-Powered Patent Analysis Platform",
      challenge: "Patent analysts spent hours manually searching and analyzing patent databases, limiting productivity and research depth.",
      solution: "Built an NLP-powered patent analysis platform leveraging LLMs to automate search, categorization, and insights extraction from patent databases.",
      impact: "Improved patent analysis productivity by 10x, enabling deeper research while reducing time-to-insight for enterprise clients.",
      metrics: ["10x productivity improvement", "40+ features delivered", "6 developers mentored", "5 enterprise projects delivered"]
    }
  },
  {
    title: 'Technical Consultant',
    company: 'Intugine Technologies',
    url: 'https://www.intugine.com/',
    date: 'Feb 2020 - Dec 2020',
    summary: 'Intugine is a leading SaaS platform specializing in logistics and supply chain visibility solutions.',
    responsibilities: [
      {
        category: 'Product Growth',
        items: [
          "Led development of a multimodal logistics platform, delivering scalable solutions for enterprise clients.", "Defined product requirements and managed the backlog, ensuring timely delivery of high-impact features.", "Improved tracking accuracy across road, rail and air by enhancing system performance and data quality.", "Designed dashboards and alerting systems to provide real-time logistics visibility.", "Collaborated with clients and cross-functional teams to improve workflows and increase platform adoption."
        ],
      },
    ],
    skills: ["Logistics product development", "Workflow optimization", "Tracking systems", "Dashboard design", "Requirements definition", "Data accuracy improvement", "Cross-functional collaboration", "User experience design", "Operational analytics", "Product backlog management"],
    achievements: ['Improved Platform Adoption', 'Enhanced Tracking Accuracy', 'Enterprise Scale Features', 'Real-time Analytics Dashboard'],
    caseStudy: {
      title: "Multi-Modal Logistics Visibility Platform",
      challenge: "Enterprise logistics teams struggled with fragmented visibility across road, rail, and air transport modes, leading to delayed decisions.",
      solution: "Developed a unified logistics visibility platform with real-time tracking, intelligent alerting, and comprehensive analytics dashboards.",
      impact: "Improved tracking accuracy across all transport modes and enabled data-driven decision making for enterprise logistics operations.",
      metrics: ["Multi-modal tracking achieved", "Real-time visibility dashboards deployed", "Enterprise client adoption increased"]
    }
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
    achievements: ['AI Healthcare Platform Vision', 'ML-driven Analytics Modules', 'Early Customer Validation', 'Healthcare Workflow Automation'],
    caseStudy: {
      title: "AI-Driven Healthcare Analytics Platform",
      challenge: "Healthcare providers lacked actionable insights from patient data, limiting their ability to predict outcomes and optimize operations.",
      solution: "Designed an AI-powered analytics platform with predictive modeling, anomaly detection, and clinical decision support dashboards.",
      impact: "Enabled healthcare teams to identify at-risk patients earlier and optimize resource allocation based on data-driven predictions.",
      metrics: ["Early patient risk prediction enabled", "Clinical decision dashboards deployed", "Healthcare compliance standards met"]
    }
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
    achievements: ['Autonomous USV Development', 'Multi-Sensor Fusion', 'Successful Field Trials', 'Navigation Accuracy Improvement'],
    caseStudy: {
      title: "Autonomous Maritime Defense Systems",
      challenge: "Defense agencies needed reliable autonomous surface vehicles capable of operating in challenging marine environments with minimal human intervention.",
      solution: "Developed autonomous USVs with multi-sensor fusion navigation, obstacle avoidance, and real-time telemetry for defense and paramilitary applications.",
      impact: "Successfully deployed autonomous systems that operated reliably in field trials, advancing India's maritime defense capabilities.",
      metrics: ["Multi-sensor fusion navigation achieved", "Successful field trials completed", "Defense-grade reliability standards met"]
    }
  },
];

// Extract unique companies for filter tabs
const uniqueCompanies = Array.from(new Set(experiences.map(exp => exp.company))).sort();

export default function Experience() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const filteredExperiences = activeCompany === null 
    ? experiences 
    : experiences.filter(exp => exp.company === activeCompany);

  return (
    <section id="experience" className="section-full-width" aria-labelledby="experience-title" role="region" aria-label="Work Experience">
      <div className="container">
        <header className="section-header animate-on-scroll">
          <h2 id="experience-title" className="section-title">Experience</h2>
          <p className="section-subtitle">9+ years building and scaling products across mobility, SaaS, robotics, and AI</p>
        </header>

        {/* Company Filter Tabs - Contact FAQ Style */}
        <div className="experience-tab-navigation animate-on-scroll">
          <button
            className={`experience-tab-button ${activeCompany === null ? 'active' : ''}`}
            onClick={() => setActiveCompany(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            All Companies
          </button>
          {uniqueCompanies.map((company) => (
            <button
              key={company}
              className={`experience-tab-button ${activeCompany === company ? 'active' : ''}`}
              onClick={() => setActiveCompany(company)}
            >
              {company}
            </button>
          ))}
        </div>

        {/* Accordion Stack Cards */}
        <div className="experience-accordion animate-on-scroll animate-delay-1">
          {filteredExperiences.map((exp, index) => {
            const originalIndex = experiences.findIndex(e => e.company === exp.company && e.title === exp.title && e.date === exp.date);
            const isExpanded = expandedCards.has(originalIndex);

            return (
              <div key={originalIndex} className={`accordion-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Card Header */}
                <div className="accordion-header">
                  <div className="company-logo">{getCompanyInitial(exp.company)}</div>
                  <div className="header-info">
                    <h3>{exp.title}</h3>
                    <span className="company-name">{exp.company}</span>
                    <div className="header-meta">
                      <span>{exp.date}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="accordion-preview">
                  <p className="summary-text">{exp.summary}</p>
                  <div className="achievements-row">
                    {exp.achievements.slice(0, 3).map((achievement, achIndex) => (
                      <span key={achIndex} className="achievement-badge">{achievement}</span>
                    ))}
                  </div>
                </div>

                {/* Trigger Button */}
                <button
                  className={`accordion-trigger ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleCard(originalIndex)}
                  aria-expanded={isExpanded}
                  aria-controls={`accordion-content-${originalIndex}`}
                >
                  <span>{isExpanded ? 'Hide Case Study & Details' : 'View Case Study & Details'}</span>
                  <ChevronIcon />
                </button>

                {/* Expanded Content */}
                <div
                  id={`accordion-content-${originalIndex}`}
                  className={`accordion-content ${isExpanded ? 'open' : ''}`}
                  role="region"
                  aria-labelledby={`accordion-header-${originalIndex}`}
                >
                  <div className="accordion-body">
                    {/* Left Column - Responsibilities */}
                    <div className="responsibilities-col">
                      <h4 className="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Key Responsibilities
                      </h4>
                      <ul className="responsibility-list">
                        {exp.responsibilities.flatMap(resp => resp.items).map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                      
                      {/* Skills Section */}
                      <div className="tech-stack-section">
                        <h4 className="section-title">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Skills Utilized
                        </h4>
                        <div className="tech-stack">
                          {exp.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Case Study */}
                    <div className="case-study-col">
                      {exp.caseStudy ? (
                        <>
                          <div className="case-study-section-block">
                            <h4 className="case-study-block-title">THE CHALLENGE</h4>
                            <p>{exp.caseStudy.challenge}</p>
                          </div>
                          <div className="case-study-section-block">
                            <h4 className="case-study-block-title">THE SOLUTION</h4>
                            <p>{exp.caseStudy.solution}</p>
                          </div>
                          <div className="case-study-section-block">
                            <h4 className="case-study-block-title">RESULTS</h4>
                            <p>{exp.caseStudy.impact}</p>
                            {exp.caseStudy.metrics && exp.caseStudy.metrics.length > 0 && (
                              <div className="metrics-grid">
                                {exp.caseStudy.metrics.slice(0, 4).map((metric, metricIndex) => (
                                  <div key={metricIndex} className="metric-item">
                                    <div className="metric-value">{metric.split(' ')[0]}</div>
                                    <div className="metric-label">{metric.split(' ').slice(1).join(' ')}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="case-study-empty">
                          <p>No case study available for this role.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
