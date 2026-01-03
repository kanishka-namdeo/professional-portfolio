'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ShowcaseItem {
  type: 'github' | 'medium';
  title: string;
  description: string;
  tags: string[];
  link: string;
  meta?: {
    language?: string;
    stars?: number;
    date?: string;
    readTime?: string;
  };
}

const showcaseItems: ShowcaseItem[] = [
  {
    type: 'github',
    title: 'MarketZen Stock Analyzer',
    description: 'A sophisticated stock market technical analysis platform with real-time indicators, signal generation, and a professional terminal-style interface. Features SMA, EMA, RSI, MACD, Bollinger Bands, and more.',
    tags: ['React 18', 'Vite', 'Tailwind CSS', 'Recharts', 'Yahoo Finance API'],
    link: 'https://github.com/kane111/marketzen-stock-analyzer',
    meta: {
      language: 'JavaScript 81.5%',
      stars: 0,
      date: 'Jan 2026',
    },
  },
  {
    type: 'github',
    title: 'rag-chat-v2',
    description: 'A modern, full-stack RAG chat application with real-time streaming, document management, and configurable AI providers. Features multi-provider support and intelligent context retrieval.',
    tags: ['Next.js 16', 'FastAPI', 'ChromaDB', 'LangChain', 'TypeScript'],
    link: 'https://github.com/kane111/rag-chat-v2',
    meta: {
      language: 'TypeScript 82%',
      stars: 0,
      date: 'Dec 2025',
    },
  },
  {
    type: 'medium',
    title: 'Vibe Coding (and not losing my mind)',
    description: 'Exploring the potential of vibe coding while maintaining mental well-being in tech. A candid reflection on balancing creativity with sustainability in software development.',
    tags: ['Vibe Coding', 'Product Management', 'Mental Wellness'],
    link: 'https://kanishkanamdeo.medium.com/vibe-coding-and-not-losing-my-mind-ac175f123155',
    meta: {
      date: 'Dec 16, 2025',
    },
  },
  {
    type: 'medium',
    title: 'Writing A Simple Kivy-based CPU-Monitoring App in Python!',
    description: 'A step-by-step guide to building a CPU monitoring application using Python, Kivy, and KivyMD. Learn how to create a functional desktop app with a clean interface.',
    tags: ['Python', 'Kivy', 'KivyMD', 'Desktop App', 'CPU Monitoring'],
    link: 'https://kanishkanamdeo.medium.com/writing-a-simple-kivy-based-cpu-monitoring-app-in-python-74e1a7e872',
    meta: {
      date: 'Apr 12, 2020',
    },
  },
  {
    type: 'medium',
    title: 'My Experiments with Elementary OS: Part 1',
    description: 'A comprehensive guide to customizing Elementary OS, one of the most elegant Ubuntu-based distributions. Learn tips and tricks to personalize your Linux experience.',
    tags: ['Linux', 'Elementary OS', 'Ubuntu', 'Customization', 'Open Source'],
    link: 'https://kanishkanamdeo.medium.com/my-experiments-with-elementary-os-part-1-4a2e81777101',
    meta: {
      date: 'Apr 6, 2020',
    },
  },
];

export default function Showcase() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [cardStride, setCardStride] = useState(0);

  const calculateStride = useCallback(() => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector('.showcase-card') as HTMLElement | null;
    if (!firstCard) return;

    const cardRect = firstCard.getBoundingClientRect();
    const scrollStyles = getComputedStyle(scrollRef.current);
    const gapValue = (scrollStyles.gap || scrollStyles.columnGap || '0').split(' ')[0];
    const gap = parseFloat(gapValue) || 0;

    setCardStride(Math.round(cardRect.width + gap));
  }, []);

  const scrollTo = useCallback((index: number, smooth: boolean = true) => {
    const stride = cardStride || 412; // fallback matches legacy width + gap
    if (scrollRef.current) {
      scrollRef.current.style.transition = smooth ? 'transform 0.3s ease-out' : 'none';
      scrollRef.current.style.transform = `translateX(-${index * stride}px)`;
    }
  }, [cardStride]);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? (currentIndex - 1 + showcaseItems.length) % showcaseItems.length
      : (currentIndex + 1) % showcaseItems.length;
    setCurrentIndex(newIndex);
    scrollTo(newIndex);
  };

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

  useEffect(() => {
    // Initialize position
    scrollTo(0, false);
    calculateStride();

    const handleResize = () => calculateStride();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [scrollTo, calculateStride]);

  return (
    <section className="showcase section-full-width" id="products" aria-labelledby="showcase-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="showcase-title" className="section-title">
            Code & Open Source
          </h2>
          <p className="section-subtitle">
            Personal projects and technical contributions
          </p>
        </div>

        <div className="showcase-carousel-container">
          <button
            className="carousel-btn carousel-prev"
            onClick={() => scroll('left')}
            aria-label="Previous project"
            disabled={showcaseItems.length <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            className="showcase-carousel"
            ref={scrollRef}
            role="list"
            aria-label="Code and open source projects"
            style={{ display: 'flex', gap: 'var(--space-lg)', willChange: 'transform' }}
          >
            {showcaseItems.map((item, index) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-card animate-on-scroll"
                role="listitem"
                aria-label={item.title}
              >
                <div className="card-header">
                  <div className={`card-icon ${item.type}`}>
                    {item.type === 'github' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                      </svg>
                    )}
                  </div>
                  {item.meta && (
                    <div className="card-meta">
                      {item.type === 'github' && item.meta.language && (
                        <span className="meta-item language">
                          <span className="language-dot"></span>
                          {item.meta.language}
                        </span>
                      )}
                      {item.meta.date && (
                        <span className="meta-item date">{item.meta.date}</span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>

                <div className="card-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <span className="link-text">
                    {item.type === 'github' ? 'View Repository' : 'Read Article'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" className="arrow-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <button
            className="carousel-btn carousel-next"
            onClick={() => scroll('right')}
            aria-label="Next project"
            disabled={showcaseItems.length <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="carousel-indicators" role="tablist" aria-label="Carousel pagination">
          {showcaseItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              role="tab"
              aria-label={`Go to project ${index + 1}`}
              onClick={() => {
                setCurrentIndex(index);
                scrollTo(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
