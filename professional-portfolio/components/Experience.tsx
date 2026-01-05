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

// Company color variant classes
const getColorVariant = (index: number): string => {
  const variants = ['variant-amber', 'variant-indigo', 'variant-teal', 'variant-red', 'variant-purple', 'variant-green', 'variant-sky'];
  return variants[index % variants.length];
};

// Extract a key metric from achievements or metrics
const getKeyMetric = (exp: Experience): { value: string; label: string } | null => {
  if (exp.caseStudy?.metrics && exp.caseStudy.metrics.length > 0) {
    const firstMetric = exp.caseStudy.metrics[0];
    const parts = firstMetric.split(' ');
    return {
      value: parts[0],
      label: parts.slice(1).join(' ').substring(0, 20)
    };
  }
  
  const achievementCount = exp.achievements.length;
  const responsibilityCount = exp.responsibilities.flatMap(r => r.items).length;
  
  if (achievementCount >= 5) {
    return { value: `${achievementCount}+`, label: 'Achievements' };
  }
  if (responsibilityCount >= 5) {
    return { value: `${responsibilityCount}`, label: 'Contributions' };
  }
  
  return { value: 'Now', label: 'Hiring' };
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
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
      metrics: ["10x faster insights", "20+ user interviews", "First beta customer secured", "4-person team built"]
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
      metrics: ["~50K daily orders", "60% dispute reduction", "40% cloud cost saved"]
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
      metrics: ["~10x ARR growth", "60K+ monthly users", "70+ locations", "3 countries"]
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
      metrics: ["10x productivity", "40+ features", "6 developers", "5 projects"]
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
      metrics: ["Multi-modal tracking", "Real-time dashboards", "Enterprise adoption"]
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
      metrics: ["Early risk prediction", "Clinical dashboards", "Healthcare compliance"]
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
      metrics: ["Multi-sensor fusion", "Field trials completed", "Defense-grade reliability"]
    }
  },
];

export default function Experience() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const filteredExperiences = activeCompany === null 
    ? experiences 
    : experiences.filter(exp => exp.company === activeCompany);

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const allResponsibilities = (exp: Experience) => 
    exp.responsibilities.flatMap(resp => resp.items);

  // Extract unique companies for filter tabs
  const uniqueCompanies = Array.from(new Set(experiences.map(exp => exp.company))).sort();

  return (
    <section id="experience" className="section-full-width" aria-labelledby="experience-title" role="region" aria-label="Work Experience">
      <div className="container">
        <header className="section-header animate-on-scroll">
          <h2 id="experience-title" className="section-title">Experience</h2>
          <p className="section-subtitle">9+ years building and scaling products across mobility, SaaS, robotics, and AI</p>
        </header>

        {/* Company Filter Tabs */}
        <div className="experience-tab-navigation animate-on-scroll" role="tablist" aria-label="Filter experiences by company">
          <button
            className={`experience-tab-button ${activeCompany === null ? 'active' : ''}`}
            onClick={() => setActiveCompany(null)}
            aria-label="Show all companies"
            aria-selected={activeCompany === null}
            role="tab"
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
              aria-label={`Filter by ${company}`}
              aria-selected={activeCompany === company}
              role="tab"
            >
              {company}
            </button>
          ))}
          <div className="scroll-hint" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Big Bang Cards - 1 Click Reveal */}
        <div className="big-bang-container">
          {filteredExperiences.map((exp, index) => {
            const globalIndex = experiences.indexOf(exp);
            const expanded = expandedCards.has(globalIndex);
            const keyMetric = getKeyMetric(exp);
            const allItems = allResponsibilities(exp);
            const colorVariant = getColorVariant(globalIndex);

            return (
              <article key={globalIndex} className={`big-bang-card ${colorVariant} ${expanded ? 'expanded' : ''}`}>
                <div className={`big-bang-header ${colorVariant}`}>
                  <div className="big-bang-company">
                    <div className={`big-bang-logo ${colorVariant}`}>
                      {getCompanyInitial(exp.company)}
                    </div>
                    <div>
                      <h3 className="big-bang-company-name">{exp.company}</h3>
                      <div className="big-bang-meta">
                        <span className="big-bang-role">{exp.title}</span>
                        <span className="big-bang-duration">{exp.date}</span>
                      </div>
                    </div>
                  </div>
                  {keyMetric && (
                    <div className={`big-bang-teaser ${colorVariant}`}>
                      <span className="big-bang-teaser-value">{keyMetric.value}</span>
                      <span className="big-bang-teaser-label">{keyMetric.label}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className={`big-bang-expand-btn ${colorVariant} ${expanded ? 'expanded' : ''}`}
                  onClick={() => toggleCard(globalIndex)}
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      <CloseIcon />
                      <span>Close Case Study</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Read Full Case Study</span>
                    </>
                  )}
                </button>
                
                <div className={`big-bang-content ${expanded ? 'active' : ''}`}>
                  <div className="big-bang-body">
                    {/* Company Brief */}
                    <div className="big-bang-section">
                      <h4 className="big-bang-section-title">Company Brief</h4>
                      <p className="big-bang-section-text">{exp.summary}</p>
                    </div>

                    {/* Key Responsibilities */}
                    <div className="big-bang-section">
                      <h4 className="big-bang-section-title">Key Responsibilities</h4>
                      <ul className="big-bang-list">
                        {allItems.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Case Study */}
                    {exp.caseStudy && (
                      <>
                        <div className="big-bang-section">
                          <h4 className="big-bang-section-title big-bang-section-challenge">The Challenge</h4>
                          <p className="big-bang-section-text">{exp.caseStudy.challenge}</p>
                        </div>

                        <div className="big-bang-section">
                          <h4 className="big-bang-section-title big-bang-section-solution">The Solution</h4>
                          <p className="big-bang-section-text">{exp.caseStudy.solution}</p>
                        </div>

                        <div className="big-bang-section">
                          <h4 className="big-bang-section-title big-bang-section-impact">The Impact</h4>
                          <p className="big-bang-section-text">{exp.caseStudy.impact}</p>
                        </div>

                        {/* Key Metrics */}
                        <div className="big-bang-section">
                          <h4 className="big-bang-section-title">Key Metrics</h4>
                          <div className="big-bang-grid">
                            {exp.caseStudy.metrics ? (
                              exp.caseStudy.metrics.map((metric, metricIndex) => {
                                const parts = metric.split(' ');
                                const value = parts[0];
                                const label = parts.slice(1).join(' ');
                                return (
                                  <div key={metricIndex} className="big-bang-metric">
                                    <div className="big-bang-metric-value">{value}</div>
                                    <div className="big-bang-metric-label">{label}</div>
                                  </div>
                                );
                              })
                            ) : (
                              <>
                                <div className="big-bang-metric">
                                  <div className="big-bang-metric-value">{exp.achievements.length}</div>
                                  <div className="big-bang-metric-label">Achievements</div>
                                </div>
                                <div className="big-bang-metric">
                                  <div className="big-bang-metric-value">{allItems.length}</div>
                                  <div className="big-bang-metric-label">Contributions</div>
                                </div>
                                <div className="big-bang-metric">
                                  <div className="big-bang-metric-value">{exp.skills.length}</div>
                                  <div className="big-bang-metric-label">Skills</div>
                                </div>
                                <div className="big-bang-metric">
                                  <div className="big-bang-metric-value">1</div>
                                  <div className="big-bang-metric-label">Case Study</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Skills */}
                    <div className="big-bang-section">
                      <h4 className="big-bang-section-title">Skills & Tools</h4>
                      <div className="big-bang-tags">
                        {exp.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="big-bang-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
