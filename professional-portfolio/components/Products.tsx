'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { products, getMediaSourceClass } from '@/data/product-media-data';

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
      <section id="products-contributed" className="section-full-width" aria-labelledby="products-title">
        <div className="container">
          <header className="section-header animate-on-scroll">
            <h2 id="products-title" className="section-title">Products Contributed</h2>
            <p className="section-subtitle">Notable products and projects I&apos;ve led or significantly contributed to</p>
          </header>
          
          <div className="products-grid" role="list" aria-label="Products and projects">
            {products.map((product, index) => (
              <div
                key={index}
                className={`product-card-wrapper animate-on-scroll ${index >= 3 ? 'animate-delay-1' : ''}`}
                role="listitem"
              >
                <div
                  className="product-card"
                  style={!product.url ? { cursor: 'default' } : {}}
                  onClick={(e) => {
                    if (product.url && e.target === e.currentTarget) {
                      window.open(product.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <div className="product-image-container">
                    <Image
                      src={product.image}
                      alt={product.altText || `${product.title} logo`}
                      className="product-image"
                      width={400}
                      height={160}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={`product-role-badge product-role-${product.role.toLowerCase()}`} aria-label={`Role: ${product.role}`}>{product.role}</span>
                    <span className="product-category-badge">{product.category}</span>
                    {product.hasCaseStudy && (
                      <span className="product-case-study-badge" onClick={(e) => handleOpenCaseStudy(e, product.caseStudyId!)} role="button" tabIndex={0} aria-label="View case study">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Case Study</span>
                      </span>
                    )}
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">
                      {product.url ? (
                        <a 
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${product.title} - ${product.role} - ${product.category}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.title}
                        </a>
                      ) : (
                        product.title
                      )}
                    </h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-tags" aria-label="Technologies and skills used">
                      {product.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="product-tag">{tag}</span>
                      ))}
                    </div>
                    
                    {/* Media Row - Only shows if product has media coverage */}
                    {product.media && product.media.length > 0 && (
                      <div className="product-media-row" aria-label="Media coverage">
                        <span className="media-row-label">In the Press:</span>
                        <div className="media-row-links">
                          {product.media.map((media, mediaIndex) => (
                            <a
                              key={mediaIndex}
                              href={media.url}
                              className={`media-row-link ${getMediaSourceClass(media.source)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={media.title}
                              aria-label={`Read about ${product.title} on ${media.source}`}
                            >
                              <span className="media-link-text">{media.source}</span>
                              <span className="media-link-arrow" aria-hidden="true">→</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <span id="product-link-hint" className="sr-only">Opens in new tab</span>
                  </div>
                </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="case-study-modal-content">
              <iframe
                src="/case-study-rentlz.html"
                className="case-study-iframe"
                title="MoveInSync Rentlz Case Study"
                aria-label="Case study content"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
