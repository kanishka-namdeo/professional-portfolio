'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const products = [
  {
    title: 'MoveInSync Business Travel Solution',
    role: 'Led',
    description: 'Corporate car rental SaaS platform driving 8x ARR increase and 12x product usage growth with 30K+ users across 50+ locations.',
    image: '/imgs/corporate-car-rental-fleet-variety.jpg',
    altText: 'Diverse fleet of corporate rental cars representing the MoveInSync business travel solution with vehicles ranging from sedans to SUVs',
    category: 'SaaS, Mobility',
    tags: ['8x ARR Increase', '30K+ Users', '50+ Locations'],
    url: 'https://moveinsync.com/corporate-car-rental-solution/',
    hasCaseStudy: true,
    caseStudyId: 'rentlz',
  },
  {
    title: 'Spectre Modular Drone / UAV Control Software',
    role: 'Built',
    description: 'UAV control software and drone swarm algorithm achieving 15% cost savings. India\'s first modular drone with 50-minute endurance.',
    image: '/imgs/autonomous-drone-ces-innovation-award-2021.jpg',
    altText: 'Spectre modular drone at CES 2021 showcasing India\'s first modular UAV with advanced control software and swarm algorithm capabilities',
    category: 'Robotics, Defense',
    tags: ['15% Cost Savings', '50-min Endurance', 'India\'s First Modular Drone'],
    url: 'https://www.sagardefence.com/uav/',
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    title: 'Natural Language Processing MVP',
    role: 'Led',
    description: 'NLP solution using LLMs for patent analysis, increasing productivity by 10x.',
    image: '/imgs/ai-ml-nlp-deep-learning-relationship-venn-diagram.jpg',
    altText: 'Venn diagram illustrating AI, machine learning, and natural language processing relationships in the NLP deep learning technology stack',
    category: 'AI/ML, NLP',
    tags: ['10x Productivity', 'LLM Integration', 'Patent Analysis'],
    url: 'https://tekip.com/it/',
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    title: 'In-plant Tracking System',
    role: 'Shaped',
    description: 'IoT-based tracking system for efficient vehicle movement in warehouses using smart sensing technology.',
    image: '/imgs/isometric-warehouse-logistics-wms-infographic.jpg',
    altText: 'Isometric warehouse layout illustration demonstrating IoT-based vehicle tracking and warehouse management system with smart sensors',
    category: 'IoT, Logistics',
    tags: ['IoT-based', 'Smart Sensing', 'Enterprise'],
    url: 'https://www.intugine.com/solutions/inplant-tracking',
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    title: 'Trashfin / Wasteshark Water Cleaning Drone',
    role: 'Built',
    description: 'Autonomous water surface cleaning drone capable of collecting 350kg garbage in 8 hours.',
    image: '/imgs/ocean_cleanup_barrier_system_plastic_removal.jpg',
    altText: 'Ocean cleanup barrier system removing plastic waste from water surface, demonstrating autonomous marine garbage collection technology',
    category: 'Robotics, Environmental',
    tags: ['350kg Capacity', '8 Hours Operation', 'Autonomous'],
    url: '',
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    title: 'Wildlife Surveillance & Anti-Poaching System',
    role: 'Built',
    description: 'Government-installed surveillance system for wildlife protection in Rajasthan\'s tiger reserves including Ranthambore and Sariska.',
    image: '/imgs/wildlife-surveillance.png',
    altText: 'Wildlife surveillance dashboard interface for anti-poaching monitoring in Rajasthan tiger reserves showing real-time animal tracking',
    category: 'Government, Conservation',
    tags: ['Rajasthan Gov', 'Tiger Reserves', 'Surveillance'],
    url: '',
    hasCaseStudy: false,
    caseStudyId: null,
  },
];

type CaseStudyId = 'rentlz' | null;

export default function Products() {
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudyId>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCaseStudy(null);
      }
    };

    if (activeCaseStudy) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeCaseStudy]);

  const handleOpenCaseStudy = (e: React.MouseEvent, caseStudyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCaseStudy(caseStudyId as CaseStudyId);
  };

  const handleCloseCaseStudy = () => {
    setActiveCaseStudy(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseCaseStudy();
    }
  };

  return (
    <>
      <section id="products-contributed" aria-labelledby="products-title">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 id="products-title" className="section-title">Products Contributed</h2>
            <p className="section-subtitle">Notable products and projects I&apos;ve led or significantly contributed to</p>
          </div>
          
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={index}
                className={`product-card-wrapper animate-on-scroll ${index >= 3 ? 'animate-delay-1' : ''}`}
              >
                <a
                  href={product.url || '#'}
                  className="product-card"
                  style={!product.url ? { cursor: 'default' } : {}}
                  target={product.url ? '_blank' : undefined}
                  rel={product.url ? 'noopener noreferrer' : undefined}
                  aria-label={product.title}
                >
                  <div className="product-image-container">
                    <Image
                      src={product.image}
                      alt={product.altText || product.title}
                      className="product-image"
                      width={400}
                      height={160}
                      loading="lazy"
                    />
                    <span className={`product-role-badge product-role-${product.role.toLowerCase()}`}>{product.role}</span>
                    <span className="product-category-badge">{product.category}</span>
                    {product.hasCaseStudy && (
                      <span className="product-case-study-badge" onClick={(e) => handleOpenCaseStudy(e, product.caseStudyId!)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Case Study
                      </span>
                    )}
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-tags">
                      {product.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="product-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      {activeCaseStudy && (
        <div 
          className="case-study-modal-overlay" 
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <div className="case-study-modal" ref={modalRef}>
            <button 
              className="case-study-close" 
              onClick={handleCloseCaseStudy}
              aria-label="Close case study"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="case-study-modal-content">
              <iframe
                src="/case-study-rentlz.html"
                className="case-study-iframe"
                title="MoveInSync Rentlz Case Study"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
