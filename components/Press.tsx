'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const withBasePath = (path: string) => `${basePath}${path}`;

interface PressItem {
  title: string;
  description: string;
  image: string;
  altText: string;
  source: string;
  date: string;
  url: string;
}

const pressItems: PressItem[] = [
  {
    title: 'Wildlife Surveillance and Anti-poaching System Installed by Rajasthan Government',
    description: 'Coverage of the wildlife surveillance and anti-poaching system developed for Rajasthan\'s tiger reserves including Ranthambore and Sariska.',
    image: withBasePath('/imgs/wildlife-surveillance.png'),
    altText: 'Screenshot of the wildlife surveillance system interface for Rajasthan\'s tiger reserves showing anti-poaching monitoring dashboard',
    source: 'BBC Referenced',
    date: 'June 2018',
    url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/',
  },
  {
    title: 'Waste Collection Drones',
    description: 'Featured coverage of innovative waste collection drone technology for water bodies and coastal areas.',
    image: withBasePath('/imgs/white-quadcopter-drone-flying-over-water-technology.jpg'),
    altText: 'White quadcopter drone flying over water demonstrating waste collection technology for lakes and coastal areas',
    source: 'BBC Featured',
    date: '2018',
    url: 'https://fb.watch/u1MvvTNV-Q/',
  },
  {
    title: 'Robots Are No Threat But An Aide To Support Production',
    description: 'Perspective on robotics as productivity enhancers rather than threats to employment in modern manufacturing.',
    image: withBasePath('/imgs/autonomous-cargo-delivery-drone-innovation.jpg'),
    altText: 'Autonomous cargo delivery drone in industrial setting illustrating robotics innovation in manufacturing support',
    source: 'Replica Substack',
    date: 'Article',
    url: 'https://r3pl1c4.substack.com/p/robots-are-no-threat-but-an-aide',
  },
  {
    title: 'Maharashtra Embraces Startups, Signs Pacts for Works Worth ₹15 Lakh',
    description: 'Coverage of Maharashtra government\'s initiative to collaborate with startups including Trashfin marine drone.',
    image: withBasePath('/imgs/autonomous-drone-technology-innovation-composite.jpg'),
    altText: 'Composite image showcasing autonomous drone technology innovation for government and industrial applications',
    source: 'The Hindu',
    date: 'July 2018',
    url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece',
  },
  {
    title: 'Welcome Trashfin, The Water Bodies Cleaner',
    description: 'Feature on Trashfin, the innovative water surface cleaning drone capable of collecting 350kg garbage in 8 hours.',
    image: withBasePath('/imgs/drone-technology-sunset-flight-innovation.jpg'),
    altText: 'Trashfin water surface cleaning drone flying at sunset, demonstrating innovative marine waste collection technology',
    source: 'Mumbai Mirror',
    date: '2018',
    url: 'https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.cms',
  },
  {
    title: 'Indian Startup Develops Wasteshark Water Surface Cleaning Drone',
    description: 'Technical coverage of the Wasteshark autonomous water surface cleaning drone innovation for environmental cleanup.',
    image: withBasePath('/imgs/autonomous-drone-ces-innovation-award-2021.jpg'),
    altText: 'Wasteshark autonomous water surface cleaning drone at CES 2021 showcasing Indian innovation in environmental technology',
    source: 'Future Entech',
    date: 'Article',
    url: 'https://futureentech.com/indian-startup-wastershark-water-surface-cleaning-drone/',
  },
];

// Duplicate items for infinite scroll effect (3 sets)
const infinitePressItems = [...pressItems, ...pressItems, ...pressItems];

function ArticleModal({
  isOpen,
  onClose,
  article
}: {
  isOpen: boolean;
  onClose: () => void;
  article: PressItem | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setShowFallback(false);
      setLoadTime(0);
      setCountdown(5);
      if (loadTimerRef.current) clearInterval(loadTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && article) {
      // Start a timer to track load time
      const startTime = Date.now();
      loadTimerRef.current = setInterval(() => {
        setLoadTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Start countdown to auto-show fallback if iframe is blocked
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Time's up, show fallback
            setIsLoading(false);
            setShowFallback(true);
            if (loadTimerRef.current) clearInterval(loadTimerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (loadTimerRef.current) clearInterval(loadTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isOpen, article]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setShowFallback(false);
    if (loadTimerRef.current) clearInterval(loadTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setShowFallback(true);
    if (loadTimerRef.current) clearInterval(loadTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const openInNewTab = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      className="article-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="article-modal-container">
        <div className="article-modal-header">
          <div className="article-modal-title-container">
            <h3 id="modal-title" className="article-modal-title">{article.title}</h3>
            <span className="article-modal-source">{article.source}</span>
          </div>
          <div className="article-modal-actions">
            <button
              className="article-modal-external-btn"
              onClick={openInNewTab}
              aria-label="Open in new tab"
              title="Open in new tab"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button
              className="article-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="article-modal-body">
          {isLoading && !showFallback && (
            <div className="article-modal-loader">
              <div className="loader-spinner"></div>
              <span>Loading content...</span>
              <div className="loader-info">
                {countdown > 0 ? (
                  <span className="loader-countdown">Auto-opening in {countdown}s...</span>
                ) : (
                  <span className="loader-time">Trying for {formatTime(loadTime)}</span>
                )}
              </div>
            </div>
          )}
          {showFallback && (
            <div className="article-modal-fallback">
              <div className="fallback-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4>Website Blocks Embedding</h4>
              <p>This website prevents embedding. Your content will open in a new tab instead.</p>
              <div className="fallback-actions">
                <button className="fallback-btn primary" onClick={openInNewTab}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in New Tab
                </button>
              </div>
              <p className="fallback-hint">Click the button above or press any key to continue</p>
            </div>
          )}
          <iframe
            src={article.url}
            className={`article-modal-iframe ${showFallback ? 'iframe-hidden' : ''}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={article.title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

export default function Press() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(pressItems.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<PressItem | null>(null);
  const cardWidth = 360 + 32; // card width + gap

  const scrollTo = useCallback((index: number, smooth: boolean = true) => {
    if (scrollRef.current) {
      scrollRef.current.style.transition = smooth && !isDragging ? 'transform 0.3s ease-out' : 'none';
      scrollRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  }, [cardWidth, isDragging]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current && isTransitioning) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);

      // Check if we've scrolled past the last set
      if (index >= pressItems.length * 2) {
        setIsTransitioning(false);
        scrollTo(pressItems.length, false);
        setCurrentIndex(pressItems.length);
        setTimeout(() => setIsTransitioning(true), 50);
      }
      // Check if we've scrolled before the first set
      else if (index < pressItems.length) {
        setIsTransitioning(false);
        scrollTo(pressItems.length * 2, false);
        setCurrentIndex(pressItems.length * 2);
        setTimeout(() => setIsTransitioning(true), 50);
      } else {
        setCurrentIndex(index);
      }
    }
  }, [cardWidth, isTransitioning, scrollTo]);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollTo(newIndex);
  };

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current ? parseFloat(scrollRef.current.style.transform.replace(/[^-?0-9.]/g, '') || String(currentIndex * cardWidth)) : 0);
  }, [cardWidth, currentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startX) * 1.5; // Reversed: drag left moves content right, drag right moves content left
    const newTransform = scrollLeft + walk;
    scrollRef.current.style.transition = 'none';
    scrollRef.current.style.transform = `translateX(${newTransform}px)`;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    setIsDragging(false);

    const x = e.clientX;
    const walk = x - startX; // Reversed direction
    const threshold = cardWidth * 0.3; // Drag threshold to change slide

    let newIndex = currentIndex;
    if (walk > threshold) {
      newIndex = currentIndex - 1; // Drag right goes to previous
    } else if (walk < -threshold) {
      newIndex = currentIndex + 1; // Drag left goes to next
    }

    setCurrentIndex(newIndex);
    scrollTo(newIndex);
  }, [isDragging, startX, currentIndex, cardWidth, scrollTo]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && scrollRef.current) {
      setIsDragging(false);
      scrollTo(currentIndex);
    }
  }, [isDragging, currentIndex, scrollTo]);

  const handleCardClick = useCallback((e: React.MouseEvent, item: PressItem) => {
    e.preventDefault();
    setSelectedArticle(item);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    // Initial position at the middle set
    scrollTo(pressItems.length, false);
  }, [scrollTo]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <section id="press" aria-labelledby="press-title">
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={selectedArticle}
      />

      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="press-title" className="section-title">Press & Media</h2>
          <p className="section-subtitle">Featured articles and media coverage</p>
        </div>

        <div className="press-carousel-container">
          <button
            className="carousel-btn carousel-prev"
            onClick={() => scroll('left')}
            aria-label="Previous press articles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            className="press-carousel"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            role="list"
            aria-label="Press and media coverage"
          >
            {infinitePressItems.map((item, index) => (
              <button
                key={index}
                className="press-card animate-on-scroll"
                role="listitem"
                aria-label={item.title}
                onClick={(e) => handleCardClick(e, item)}
              >
                <div className="press-image-container">
                  <Image
                    src={item.image}
                    alt={item.altText || item.title}
                    className="press-image"
                    width={400}
                    height={140}
                    loading="lazy"
                  />
                  <div className="press-source-badge">{item.source}</div>
                </div>
                <div className="press-content">
                  <h3 className="press-title">{item.title}</h3>
                  <p className="press-description">{item.description}</p>
                  <div className="press-meta">
                    <span className="press-date">{item.date}</span>
                    <span className="press-read-more">Read Article →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            className="carousel-btn carousel-next"
            onClick={() => scroll('right')}
            aria-label="Next press articles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="carousel-indicators" role="tablist" aria-label="Press carousel pagination">
          {pressItems.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentIndex % pressItems.length ? 'active' : ''}`}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
