'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, ExternalLink, Grid3X3, Newspaper, BookOpen, ArrowRight } from 'lucide-react';

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

interface PressMention {
  headline: string;
  source: string;
  url: string;
  date: string;
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
  press?: PressMention[];
  industries?: string[];
}

// Get company initial for logo
const getCompanyInitial = (company: string): string => {
  return company.charAt(0).toUpperCase();
};

// Cycle through color variants for visual variety
const getColorVariant = (index: number): string => {
  const variants = ['variant-primary', 'variant-teal', 'variant-amber', 'variant-rose', 'variant-violet'];
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

const experiences: Experience[] = [
  {
    title: 'Product & AI Consultant',
    company: 'AvloAI',
    url: '',
    date: 'Jan 2026 - Present',
    summary: 'AvloAI is building an AI-powered children\'s storytelling platform with multi-agent orchestration, voice cloning, and multilingual content generation.',
    responsibilities: [
      {
        category: 'Product Strategy & MVP Execution',
        items: [
          "Advised founding team on product strategy and technical architecture for AI storytelling platform, guiding transition from prototype to production-grade freemium service.",
          "Architected multi-agent story generation pipeline (SafetyGuardian → StoryWriter → Illustrator → Narrator → LearningAdvisor) coordinating CDC milestone-mapped and APA Bright Futures aligned content for ages 2-8.",
          "Designed ElevenLabs voice cloning integration enabling 30-second voice capture and instant voice model generation, preserving family storytelling across distances with grandparent voice cloning as premium differentiator.",
          "Built multilingual story engine supporting 22 natively-written languages (Hinglish, Spanglish, Tamil, French, and others) using language-specific prompt engineering rather than translation pipelines.",
          "Designed COPPA 2.0 compliant data architecture following April 2026 amendments, implementing verifiable parental consent flows, biometric data handling for voiceprints, and automated retention policies."
        ],
      },
    ],
    skills: ["Product strategy", "Multi-agent AI orchestration", "Voice cloning (ElevenLabs)", "Multilingual AI generation", "COPPA 2.0 compliance", "Biometric data handling", "Freemium conversion optimization", "Child development frameworks", "RAG pipeline design", "Parental consent flows"],
    achievements: ["Advised on product strategy for AI storytelling platform serving thousands of families with personalized narratives in 22 natively-written languages", "Architected ElevenLabs voice cloning pipeline enabling grandparent voice preservation in 30 seconds", "Designed COPPA 2.0 compliant data architecture addressing April 2026 amendments for biometric voice data"],
    press: [],
    industries: ["EdTech", "AI/ML", "Consumer SaaS", "Family Technology"],
    caseStudy: {
      title: "AI-Powered Children's Storytelling Platform",
      challenge: "Parents sought personalized, educational storytelling experiences that could adapt to children's developmental milestones while preserving family voices and cultural diversity.",
      solution: "Built a multi-agent AI platform with voice cloning, 22-language support, and adaptive learning loops that personalize story complexity and themes to each child's evolving interests.",
      impact: "Enabled thousands of families to create personalized stories in native languages with grandparent voice cloning, establishing emotional differentiation in children's content market.",
      metrics: ["22 languages", "30-second voice cloning", "5-agent pipeline", "COPPA 2.0 compliant"]
    }
  },
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
    press: [
    ],
    industries: ["Wealth Management", "Private Banking", "Enterprise AI", "SaaS"],
    caseStudy: {
      title: "AI-Native Wealth Management Platform",
      challenge: "Private banking firms struggled with fragmented workflows and lack of personalized investment insights for high-net-worth clients.",
      solution: "Built an AI-native platform leveraging AI-agents to automate personalized investment workflows, combining data aggregation with intelligent recommendations.",
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
        items: [
          "Scoped core MVP features for a video intelligence system, ensuring smooth client deployment.", 
          "Integrated with OMS and support tools, improving dispute resolution speed.", "Designed storage optimization workflows, reducing cloud costs through compression and archival.", 
          "Enabled high-volume processing of ~50K daily orders, ensuring system reliability.", 
          "Coordinated with client teams to ensure adoption and seamless workflow integration."]
      },
    ],
    skills: ["MVP delivery", "Video intelligence systems", "Storage optimization", "Cloud cost reduction", "Low-latency workflow design", "OMS integration", "Automated tagging", "Retrieval system design", "High-volume system design"],
    achievements: ["Delivered a high-volume video intelligence MVP", 
      "Reduced cloud costs through optimized storage and compression", "Built fast retrieval workflows for operational teams", 
      "Integrated seamlessly with client OMS and support tools", 
      "Launched automated tagging and retrieval features", 
      "Enabled smooth adoption of the MVP by client teams"],
    caseStudy: {
      title: "Video Intelligence for E-commerce",
      challenge: "E-commerce client needed automated video analysis to reduce manual review workload and improve dispute resolution accuracy.",
      solution: "Developed a video intelligence MVP with automated tagging, compression, and fast retrieval capabilities integrated with existing OMS.",
      impact: "Reduced dispute resolution time by 60% while processing 50K+ daily video uploads with optimized cloud infrastructure.",
      metrics: ["~50K daily orders", "60% dispute reduction", "40% cloud cost saved"]
    },
    industries: ["E-commerce", "Logistics", "SaaS"],
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
          ["Defined product vision and roadmap, driving 10x ARR growth and 15x usage increase.", "Expanded operations to 50+ new locations, enabling international market growth.", "Improved mobile app experience, increasing adoption by 20%.", "Rolled out invoicing, ERP integrations, and payments, adding 6+ clients to the upsell pipeline.", "Managed an 8-person sprint team, doubling productivity through better prioritization."]
      },
    ],
    skills: ["Product scaling", "Client onboarding", "International expansion", "Feature rollout", "API integrations", "Payments and invoicing", "User experience improvement", "Market research", "Product roadmap planning", "Cross-functional leadership"],
    achievements: ["Drove ~10x ARR growth and 15x product usage", "Onboarded 15+ enterprise clients and 70,000+ monthly users", "Expanded operations to 70+ new locations across 3 countries", "Launched features that improved user adoption and experience", "Built integrations that reduced implementation time by 40%", "Introduced payments and invoicing features to strengthen monetization"],
    press: [
      {
        headline: "Indian Startup MoveInSync Pioneers Intelligent Commutes Across the Globe",
        source: "Impakter",
        url: "https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/",
        date: "2024"
      },
      {
        headline: "Business RentLZ - Enterprise Vehicle Management Solution",
        source: "MoveInSync",
        url: "https://moveinsync.com/business-rentlz",
        date: "2024"
      }
    ],
    caseStudy: {
      title: "Enterprise Transport Platform Scale-Up",
      challenge: "Scaling a successful TaaS platform from regional to global presence while maintaining product quality and driving revenue growth.",
      solution: "Led strategic expansion to 70+ locations across 3 countries, launched mobile-first experience improvements, and built native payments/invoicing capabilities.",
      impact: "Achieved 10x ARR growth, expanded to 70,000+ monthly users, and established the platform as the market leader in enterprise transport management.",
      metrics: ["~10x ARR growth", "70K+ monthly users", "70+ locations", "3 countries"]
    },
    industries: ["Enterprise SaaS", "Transportation", "Mobility", "Corporate Travel"],
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
    },
    industries: ["Legal Tech", "Patent Management", "SaaS", "NLP/AI"],
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
    press: [
      {
        headline: "Intugine Technologies - Logistics Visibility Solutions",
        source: "Facebook",
        url: "https://www.facebook.com/watch/?v=236228024272951",
        date: "2020"
      }
    ],
    caseStudy: {
      title: "Multi-Modal Logistics Visibility Platform",
      challenge: "Enterprise logistics teams struggled with fragmented visibility across road, rail, and air transport modes, leading to delayed decisions.",
      solution: "Developed a unified logistics visibility platform with real-time tracking, intelligent alerting, and comprehensive analytics dashboards.",
      impact: "Improved tracking accuracy across all transport modes and enabled data-driven decision making for enterprise logistics operations.",
      metrics: ["Multi-modal tracking", "Real-time dashboards", "Enterprise adoption"]
    },
    industries: ["Logistics", "Supply Chain", "Transportation", "Enterprise SaaS"],
  },
  {
    title: 'Senior Technical Consultant',
    company: 'Medulla.AI',
    url: '',
    date: 'Jul 2020 - Nov 2020',
    summary: 'Medulla.AI develops custom AI-driven solutions for enterprise clients, including an automated loan processing pipeline using NLP and OCR.',
    responsibilities: [
      {
        category: 'Technical Collaboration',
        items: [
          'Built end-to-end automated loan processing pipeline using NLP and OCR (Amazon Textract) with custom document parsing in Python/Django, reducing document analysis time by 5X vs. manual review.',
          'Implemented document classification to auto-detect types (pay stubs, tax returns, bank statements, IDs) and route each to the appropriate parsing pipeline with NLP-driven validation against lending criteria.',
          'Designed confidence scoring with automated fallback workflows routing low-confidence extractions for manual review, plus automated inconsistency detection flagging data mismatches across key fields.',
          'Built async processing architecture using Celery for parallel OCR job processing without blocking API requests, with automated workflows routing parsed data to downstream underwriting systems.',
          'Orchestrated end-to-end loan processing workflows using Apache Airflow, managing complex DAGs for document ingestion, OCR processing, classification, validation, and routing to underwriting systems.',
          'Implemented compliance-ready infrastructure: audit logging for all application actions, PII encryption at rest and in transit, role-based access controls, and data retention policies for financial regulatory requirements.'
        ],
      },
    ],
    skills: ["Python", "Django", "Amazon Textract", "OCR", "NLP", "Document parsing", "Data pipelines", "REST APIs", "Loan processing automation", "Document classification", "Confidence scoring", "Celery", "Apache Airflow", "Async processing", "Audit logging", "PII handling", "Encryption", "Financial compliance", "Underwriting systems", "Role-based access control"],
    achievements: ['Automated loan processing pipeline (NLP + OCR + Amazon Textract) reducing document analysis time by 5X', 'Implemented confidence scoring and inconsistency detection flagging data mismatches across loan applications', 'Built compliance-ready infrastructure with accuracy tracking dashboards, audit logging, and PII encryption'],
    caseStudy: {
      title: "Automated Loan Processing Pipeline",
      challenge: "Manual loan document review was slow and error-prone, with lenders spending hours analyzing pay stubs, tax returns, bank statements, and IDs for each application.",
      solution: "Built an end-to-end automated pipeline using NLP and OCR (Amazon Textract) with document classification, confidence scoring, Celery async processing, and Apache Airflow orchestration.",
      impact: "Reduced document analysis time by 5X vs. manual review, with confidence scoring and automated fallback workflows maintaining accuracy at scale for financial regulatory compliance.",
      metrics: ["5X faster analysis", "Confidence scoring", "Compliance-ready infrastructure"]
    },
    industries: ["FinTech", "Document Processing", "NLP/AI", "Enterprise AI"],
  },
  {
    title: 'Co-founding member & Chief Technical Officer',
    company: 'Sagar Defence Engineering',
    url: 'https://www.sagardefence.com/',
    date: 'Jun 2016 - Feb 2020',
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
    press: [
      {
        headline: "Wildlife Surveillance and Anti-Poaching System Installed by Rajasthan Government",
        source: "Naya Rajasthan",
        url: "https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/",
        date: "Jun 2018"
      },
      {
        headline: "Welcome TrashFin - The Water Bodies Cleaner",
        source: "Mumbai Mirror",
        url: "https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.html",
        date: "2018"
      },
      {
        headline: "State Embraces Startups, Signs Pacts for Works Worth 15 Lakh",
        source: "The Hindu",
        url: "https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece",
        date: "2018"
      }
    ],
    caseStudy: {
      title: "Autonomous Maritime Defense Systems",
      challenge: "Defense agencies needed reliable autonomous surface vehicles capable of operating in challenging marine environments with minimal human intervention.",
      solution: "Developed autonomous USVs with multi-sensor fusion navigation, obstacle avoidance, and real-time telemetry for defense and paramilitary applications.",
      impact: "Successfully deployed autonomous systems that operated reliably in field trials, advancing India's maritime defense capabilities.",
      metrics: ["Multi-sensor fusion", "Field trials completed", "Defense-grade reliability"]
    },
    industries: ["Defense Technology", "Maritime Robotics", "Aerospace", "Autonomous Systems"],
  },
];

export default function Experience() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [autoExpandedCard, setAutoExpandedCard] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const filteredExperiences = useMemo(() => 
    activeCompany === null 
      ? experiences 
      : experiences.filter(exp => exp.company === activeCompany),
    [activeCompany]
  );

  // Auto-expand when only one card is shown, collapse when showing multiple
  useEffect(() => {
    // Reset user interaction flag when filter changes
    setUserInteracted(false);
    
    if (filteredExperiences.length === 1) {
      const singleExp = filteredExperiences[0];
      const globalIndex = experiences.indexOf(singleExp);
      
      // Auto-expand the single card
      setExpandedCards(new Set([globalIndex]));
      setAutoExpandedCard(globalIndex);
    } else {
      // When showing multiple cards, collapse all
      setExpandedCards(new Set());
      setAutoExpandedCard(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompany, filteredExperiences]);

  // Cleanup: Restore body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const toggleCard = (index: number) => {
    // When manually toggling, clear auto-expanded state for that card
    const newAutoExpanded = autoExpandedCard === index ? null : autoExpandedCard;
    setAutoExpandedCard(newAutoExpanded);

    const newExpanded = new Set(expandedCards);
    const wasExpanded = newExpanded.has(index);

    if (wasExpanded) {
      // User is collapsing the card
      newExpanded.delete(index);
      setUserInteracted(true); // Mark that user manually changed the state

      // Unlock body scroll on mobile
      if (typeof window !== 'undefined' && window.innerWidth <= 640) {
        document.body.style.overflow = '';
      }
    } else {
      // User is expanding the card
      newExpanded.add(index);
      // Clear user interaction flag since they're now expanding
      setUserInteracted(false);

      // Lock body scroll on mobile
      if (typeof window !== 'undefined' && window.innerWidth <= 640) {
        document.body.style.overflow = 'hidden';
      }

      // Scroll to card top on mobile for better UX
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        setTimeout(() => {
          const cardElement = document.querySelector(`.big-bang-card:nth-child(${index + 1})`);
          if (cardElement) {
            const navHeight = 60; // Mobile nav height
            const cardTop = cardElement.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: cardTop, behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setExpandedCards(newExpanded);
  };

  const minimizeCard = (index: number) => {
    // Minimize without clearing auto-expanded state (user can still auto-expand)
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
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
            <Grid3X3 size={20} />
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
                      <div className="big-bang-company-row">
                        <h3 className="big-bang-company-name">{exp.company}</h3>
                        {exp.url && (
                          <a 
                            href={exp.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="big-bang-website-link"
                            aria-label={`Visit ${exp.company} website`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
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
                
                {/* Company Brief - Visible always, before expand button */}
                <div className="big-bang-brief">
                  <p className="big-bang-brief-text">{exp.summary}</p>
                </div>
                
                {/* Industry Verticals - Compact horizontal tags between header and metric */}
                {exp.industries && exp.industries.length > 0 && (
                  <div className="big-bang-industries-compact">
                    {exp.industries.map((industry, indIndex) => (
                      <span key={indIndex} className="big-bang-industries-compact-tag">{industry}</span>
                    ))}
                  </div>
                )}
                
                {/* News Cover - Press indicator on card cover */}
                {exp.press && exp.press.length > 0 && !expanded && (
                  <div className="big-bang-news-cover">
                    <div className="big-bang-news-cover-header">
                      <Newspaper size={20} className="big-bang-news-cover-icon" />
                      <span className="big-bang-news-cover-label">In the News</span>
                      <span className="big-bang-news-cover-count">{exp.press.length} mention{exp.press.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="big-bang-news-cover-preview">
                      <span className="big-bang-news-cover-source">{exp.press[0].source}</span>
                      <span className="big-bang-news-cover-divider">-</span>
                      <span className="big-bang-news-cover-headline">{exp.press[0].headline.length > 50 ? exp.press[0].headline.substring(0, 50) + '...' : exp.press[0].headline}</span>
                    </div>
                  </div>
                )}
                
                <button
                  className={`big-bang-expand-btn ${colorVariant} ${expanded ? 'expanded' : ''}`}
                  onClick={() => toggleCard(globalIndex)}
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      <X size={20} strokeWidth={3} />
                      <span>Close Case Study</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      <span>Read Full Case Study</span>
                    </>
                  )}
                </button>

                {expanded && (
                  <div className="big-bang-backdrop" onClick={() => toggleCard(globalIndex)} />
                )}

                <div className={`big-bang-content ${expanded ? 'active' : ''}`}>
                  <div className="big-bang-body">
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

                    {/* News Rail - Press Mentions */}
                    {exp.press && exp.press.length > 0 && (
                      <div className="big-bang-news-rail">
                        <h4 className="big-bang-news-title">
                          <Newspaper size={20} />
                          In the News
                        </h4>
                        <div className="big-bang-news-list">
                          {exp.press.map((mention, mentionIndex) => (
                            <a
                              key={mentionIndex}
                              href={mention.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="big-bang-news-item"
                            >
                              <div className="big-bang-news-icon">
                                {mention.source.charAt(0)}
                              </div>
                                <div className="big-bang-news-content">
                                  <div className="big-bang-news-meta">
                                    <span className="big-bang-news-source">{mention.source}</span>
                                    <span className="big-bang-news-date">{mention.date}</span>
                                  </div>
                                  <div className="big-bang-news-headline">{mention.headline}</div>
                                </div>
                                <ArrowRight size={20} className="big-bang-news-arrow" />
                              </a>
                          ))}
                        </div>
                      </div>
                    )}
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
