'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { SkeletonCard } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';
import { Code2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ShowcaseItem {
  type: 'github' | 'medium';
  title: string;
  description: string;
  tags: string[];
  link: string;
  thumbnail?: string;
  meta?: {
    language?: string;
    stars?: number;
    date?: string;
    readTime?: string;
  };
}

const githubItems: ShowcaseItem[] = [
  {
    type: 'github',
    title: 'pi-dash',
    description: 'Multi-agent orchestration dashboard: many agents, one unified surface for managing and monitoring AI agents',
    tags: ['TypeScript', 'React', 'Next.js', 'Multi-Agent', 'Orchestration'],
    link: 'https://github.com/kanishka-namdeo/pi-dash',
    thumbnail: 'https://picsum.photos/seed/pi-dash-dashboard/600/400',
    meta: {
      language: 'TypeScript',
      stars: 0,
      date: '2026',
    },
  },
  {
    type: 'github',
    title: 'social-beam',
    description: 'Full-stack social media platform with AI agents, multi-platform integration, and real-time content aggregation',
    tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'AI Agents', 'Stable Diffusion'],
    link: 'https://github.com/kanishka-namdeo/social-beam',
    thumbnail: 'https://picsum.photos/seed/social-beam-platform/600/400',
    meta: {
      language: 'TypeScript',
      stars: 0,
      date: '2025',
    },
  },
  {
    type: 'github',
    title: 'thetell',
    description: 'AI-powered corporate intelligence platform: dual-agent debate, 25+ signal sources, Neo4j graph DB, confidence scoring',
    tags: ['TypeScript', 'Next.js', 'Neo4j', 'LlamaIndex', 'Multi-Agent', 'NLP'],
    link: 'https://github.com/kanishka-namdeo/thetell',
    thumbnail: 'https://picsum.photos/seed/corporate-intelligence/600/400',
    meta: {
      language: 'TypeScript',
      stars: 0,
      date: '2025',
    },
  },
  {
    type: 'github',
    title: 'yfnhanced-mcp',
    description: 'Production-grade MCP server for Yahoo Finance with circuit breaker, rate limiting, caching',
    tags: ['TypeScript', 'MCP', 'Redis', 'Financial Data', 'npm package'],
    link: 'https://github.com/kanishka-namdeo/yfnhanced-mcp',
    thumbnail: 'https://picsum.photos/seed/yahoo-finance-mcp/600/400',
    meta: {
      language: 'TypeScript',
      stars: 7,
      date: '2025',
    },
  },
  {
    type: 'github',
    title: 'Twin',
    description: 'Privacy-first AI meeting assistant built with Rust for local processing',
    tags: ['Rust', 'Privacy', 'Local AI', 'Audio Processing'],
    link: 'https://github.com/kanishka-namdeo/Twin',
    meta: {
      language: 'Rust',
      stars: 0,
      date: '2025',
    },
  },
  {
    type: 'github',
    title: 'rag-chat-v2',
    description: 'Full-stack RAG chat with document upload, vector search, multi-provider LLM support',
    tags: ['TypeScript', 'Python', 'Next.js', 'FastAPI', 'ChromaDB', 'LangChain'],
    link: 'https://github.com/kanishka-namdeo/rag-chat-v2',
    thumbnail: 'https://picsum.photos/seed/rag-chatbot/600/400',
    meta: {
      language: 'TypeScript 82%',
      stars: 1,
      date: '2026',
    },
  },
  {
    type: 'github',
    title: 'coding-plan-proxy',
    description: 'Production-grade HTTP proxy for AI coding APIs with multi-layer rate limiting and TUI dashboard',
    tags: ['Python', 'TUI', 'Rate Limiting', 'Circuit Breaker', 'SSE Streaming'],
    link: 'https://github.com/kanishka-namdeo/coding-plan-proxy',
    thumbnail: 'https://picsum.photos/seed/http-proxy-api/600/400',
    meta: {
      language: 'Python',
      stars: 1,
      date: '2026',
    },
  },
  {
    type: 'github',
    title: 'instructify',
    description: 'Research-backed Cursor IDE configuration for faster, smarter AI coding agents',
    tags: ['TypeScript', 'Cursor IDE', 'AI Agent Configuration', 'Developer Tools'],
    link: 'https://github.com/kanishka-namdeo/instructify',
    thumbnail: 'https://picsum.photos/seed/cursor-ide-config/600/400',
    meta: {
      language: 'TypeScript',
      stars: 1,
      date: '2025',
    },
  },
];

const mediumArticlesFallback: ShowcaseItem[] = [
  {
    type: 'medium',
    title: 'MCP File Search That Actually Works (Everywhere)',
    description: 'Building a cross-platform MCP server for instant file search using Everything on Windows, Spotlight on macOS, and ripgrep on Linux',
    tags: ['MCP', 'Open Source', 'Search', 'AI Tools'],
    link: 'https://kanishkanamdeo.medium.com/mcp-file-search-that-actually-works-everywhere-d139a33dfcb1',
    meta: { date: 'Jan 2026', readTime: '8 min read' },
  },
  {
    type: 'medium',
    title: 'Vibe Coding (and not losing my mind)',
    description: 'How I built a full RAG workbench with Next.js and FastAPI using only AI-assisted coding, lessons, prompts, and pitfalls',
    tags: ['AI', 'Vibe Coding', 'LLM', 'Product Management'],
    link: 'https://kanishkanamdeo.medium.com/vibe-coding-and-not-losing-my-mind-ac175f123155',
    meta: { date: 'Dec 2025', readTime: '10 min read' },
  },
  {
    type: 'medium',
    title: 'Writing A Simple Kivy-based CPU-Monitoring App in Python!',
    description: 'A step-by-step guide to building a cross-platform CPU monitoring dashboard with Python, Kivy, and KivyMD',
    tags: ['Python', 'Kivy', 'UI', 'Learning'],
    link: 'https://kanishkanamdeo.medium.com/writing-a-simple-kivy-based-cpu-monitoring-app-in-python-74e1a7e872',
    meta: { date: 'Apr 2020', readTime: '7 min read' },
  },
  {
    type: 'medium',
    title: 'My Experiments with Elementary OS: Part 1',
    description: 'Customizing Elementary OS with multiple docks, battery optimization via TLP, and touchpad gestures',
    tags: ['Linux', 'Elementary OS', 'Open Source', 'DIY'],
    link: 'https://kanishkanamdeo.medium.com/my-experiments-with-elementary-os-part-1-4a2e81777101',
    meta: { date: 'Apr 2020', readTime: '6 min read' },
  },
];

function extractImageFromHtml(html: string): string | null {
  // Find all image src URLs in the HTML
  const imgMatches = html.matchAll(/<img[^>]+src="([^"]+)"/g);
  const urls = Array.from(imgMatches).map(match => match[1]);

  // Filter out tracking pixels (1x1 images) and medium stats URLs
  const validImage = urls.find(url => {
    // Skip tracking pixels and stats
    if (url.includes('/_/stat?')) return false;
    if (url.includes('medium.com/_/stat')) return false;
    // Skip very small images (likely icons/trackers)
    if (url.includes('1*') && !url.includes('max')) return false;
    // Must be a cdn-images URL from Medium
    return url.includes('cdn-images-1.medium.com');
  });

  return validImage || null;
}

function estimateReadTime(content: string): string {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}

function interleaveItems(projects: ShowcaseItem[], articles: ShowcaseItem[]): ShowcaseItem[] {
  const result: ShowcaseItem[] = [];
  const articleQueue = [...articles];
  for (let i = 0; i < projects.length; i++) {
    result.push(projects[i]);
    if (i % 3 === 2 && articleQueue.length > 0) {
      result.push(articleQueue.shift()!);
    }
  }
  while (articleQueue.length > 0) {
    result.push(articleQueue.shift()!);
  }
  return result;
}

export default function Showcase() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStride, setCardStride] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>(githubItems);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function fetchMediumArticles() {
      try {
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@kanishkanamdeo'
        );
        const data = await response.json();

        if (data.status === 'ok' && data.items) {
          const mediumItems: ShowcaseItem[] = data.items
            .slice(0, 6)
            .map((item: any) => {
              const thumbnail =
                item.thumbnail || extractImageFromHtml(item.content || item.description || '');
              const pubDate = new Date(item.pubDate);
              const dateStr = pubDate.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              });

              return {
                type: 'medium' as const,
                title: item.title,
                description: item.description
                  ?.replace(/<[^>]*>/g, '')
                  .substring(0, 150) + '...',
                tags: item.categories?.slice(0, 4) || [],
                link: item.link,
                thumbnail: thumbnail || undefined,
                meta: {
                  date: dateStr,
                  readTime: estimateReadTime(item.content || item.description || ''),
                },
              };
            });

          const combined = interleaveItems(githubItems, mediumItems);
          setShowcaseItems(combined);
        }
      } catch {
        const combined = interleaveItems(githubItems, mediumArticlesFallback);
        setShowcaseItems(combined);
      }
    }

    fetchMediumArticles();
  }, []);

  // Drag state using refs to avoid stale closures
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartTranslateRef = useRef(0);
  const dragLastXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastDragTimeRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Refs for window event handlers
  const windowMouseMoveRef = useRef<(e: MouseEvent) => void>(undefined);
  const windowMouseUpRef = useRef<(e: MouseEvent) => void>(undefined);
  const windowTouchMoveRef = useRef<(e: TouchEvent) => void>(undefined);
  const windowTouchEndRef = useRef<() => void>(undefined);

  // Cleanup function for window listeners
  const cleanupWindowListeners = useCallback(() => {
    if (windowMouseMoveRef.current) {
      window.removeEventListener('mousemove', windowMouseMoveRef.current);
    }
    if (windowMouseUpRef.current) {
      window.removeEventListener('mouseup', windowMouseUpRef.current);
    }
    if (windowTouchMoveRef.current) {
      window.removeEventListener('touchmove', windowTouchMoveRef.current);
    }
    if (windowTouchEndRef.current) {
      window.removeEventListener('touchend', windowTouchEndRef.current);
    }
  }, []);

  // Calculate stride (width of one card + gap)
  const calculateStride = useCallback(() => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector('.showcase-card') as HTMLElement | null;
    if (!firstCard) return;

    const cardRect = firstCard.getBoundingClientRect();
    const scrollStyles = getComputedStyle(scrollRef.current);
    const gapValue = (scrollStyles.gap || scrollStyles.columnGap || '0').split(' ')[0];
    const gap = parseFloat(gapValue) || 0;

    const stride = Math.round(cardRect.width + gap);
    setCardStride(stride);

    // Initialize position after stride is calculated
    if (!isInitializedRef.current && scrollRef.current) {
      scrollRef.current.style.transition = 'none';
      scrollRef.current.style.transform = `translate3d(0, 0, 0)`;
      isInitializedRef.current = true;
    }
  }, []);

  // Scroll to a specific index
  const scrollTo = useCallback((index: number, smooth: boolean = true) => {
    const stride = cardStride || 412;
    if (scrollRef.current) {
      const shouldAnimate = smooth && !prefersReducedMotion;
      scrollRef.current.style.transition = shouldAnimate ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
      scrollRef.current.style.transform = `translate3d(-${index * stride}px, 0, 0)`;
    }
    setCurrentIndex(index);
  }, [cardStride, prefersReducedMotion]);

  // Scroll left or right by one item
  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, currentIndex - 1)
      : Math.min(showcaseItems.length - 1, currentIndex + 1);
    scrollTo(newIndex);
  };

  // Get carousel boundaries
  const getCarouselBounds = useCallback(() => {
    if (!scrollRef.current) return { min: 0, max: 0 };
    const stride = cardStride || 412;
    const maxIndex = showcaseItems.length - 1;
    return {
      min: 0,
      max: maxIndex * stride
    };
  }, [cardStride]);

  // Handle drag movement
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    const deltaX = clientX - dragStartXRef.current;
    const bounds = getCarouselBounds();
    const currentTranslate = dragStartTranslateRef.current + deltaX;

    // Apply resistance at edges
    let newTranslate = currentTranslate;
    if (currentTranslate < bounds.min) {
      const over = bounds.min - currentTranslate;
      newTranslate = bounds.min - (over * 0.3);
    } else if (currentTranslate > bounds.max) {
      const over = currentTranslate - bounds.max;
      newTranslate = bounds.max + (over * 0.3);
    }

    // Use translate3d for GPU acceleration
    scrollRef.current.style.transform = `translate3d(${newTranslate}px, 0, 0)`;

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastDragTimeRef.current;
    if (timeDelta > 50) {
      const velocity = (clientX - dragLastXRef.current) / timeDelta;
      dragVelocityRef.current = velocity;
      dragLastXRef.current = clientX;
      lastDragTimeRef.current = now;
    }

    // Mark as dragged if moved more than 5 pixels
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }
  }, [getCarouselBounds]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }

    // Calculate nearest snap point
    const stride = cardStride || 412;
    const actualTranslate = dragStartTranslateRef.current + (dragLastXRef.current - dragStartXRef.current);
    const rawIndex = Math.abs(actualTranslate) / stride;
    let nearestIndex = Math.round(rawIndex);
    nearestIndex = Math.max(0, Math.min(showcaseItems.length - 1, nearestIndex));

    // Apply momentum if there was significant velocity
    if (Math.abs(dragVelocityRef.current) > 2) {
      const momentumDirection = dragVelocityRef.current > 0 ? -1 : 1;
      let momentumIndex = nearestIndex + momentumDirection;
      momentumIndex = Math.max(0, Math.min(showcaseItems.length - 1, momentumIndex));
      scrollTo(momentumIndex);
    } else {
      scrollTo(nearestIndex);
    }

    dragVelocityRef.current = 0;
    hasDraggedRef.current = false;
  }, [cardStride, scrollTo]);

  // Setup window event handlers after all drag handlers are defined
  useEffect(() => {
    windowMouseMoveRef.current = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };
    windowMouseUpRef.current = (e: MouseEvent) => {
      cleanupWindowListeners();
      handleDragEnd();
    };
    windowTouchMoveRef.current = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    };
    windowTouchEndRef.current = () => {
      cleanupWindowListeners();
      handleDragEnd();
    };

    return () => {
      cleanupWindowListeners();
    };
  }, [handleDragMove, handleDragEnd, cleanupWindowListeners]);

  // Mouse event handlers
  const handleDragStart = useCallback((clientX: number) => {
    if (showcaseItems.length <= 1) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = clientX;
    dragStartTranslateRef.current = -currentIndex * (cardStride || 412);
    dragLastXRef.current = clientX;
    dragVelocityRef.current = 0;
    hasDraggedRef.current = false;
    lastDragTimeRef.current = Date.now();

    if (scrollRef.current) {
      scrollRef.current.style.transition = 'none';
      scrollRef.current.style.cursor = 'grabbing';
    }

    // Add window-level event listeners for drag operations
    if (windowMouseMoveRef.current) {
      window.addEventListener('mousemove', windowMouseMoveRef.current);
    }
    if (windowMouseUpRef.current) {
      window.addEventListener('mouseup', windowMouseUpRef.current);
    }
    if (windowTouchMoveRef.current) {
      window.addEventListener('touchmove', windowTouchMoveRef.current);
    }
    if (windowTouchEndRef.current) {
      window.addEventListener('touchend', windowTouchEndRef.current);
    }
  }, [currentIndex, cardStride]);

  // Mouse event handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    handleDragEnd();
  }, [handleDragEnd]);

  const onMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleDragEnd();
    }
  }, [handleDragEnd]);

  // Touch event handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Prevent card click from triggering navigation (CTA only)
  const onCardClick = useCallback((e: React.MouseEvent) => {
    // Only allow click if it was on the CTA section and no drag occurred
    const ctaElement = (e.currentTarget as HTMLElement).querySelector('.card-footer');
    if (ctaElement && ctaElement.contains(e.target as Node) && !hasDraggedRef.current) {
      // Allow the default CTA navigation
      return;
    }
    // Prevent navigation for all other card clicks
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

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
  }, [isLoading, prefersReducedMotion]);

  // Simulate loading state (replace with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize position
    calculateStride();

    const handleResize = () => calculateStride();
    window.addEventListener('resize', handleResize);

    // Cleanup: Remove drag listeners if component unmounts during drag
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupWindowListeners();
    };
  }, [calculateStride, cleanupWindowListeners]);

  return (
    <section className="showcase section-full-width" id="products" aria-labelledby="showcase-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="showcase-title" className="section-title">
            Code, Writing & Open Source
          </h2>
          <p className="section-subtitle">
            Personal projects, technical articles, and contributions
          </p>
        </div>

        {isLoading ? (
          <div className="showcase-carousel-wrapper">
            <div className="showcase-carousel-container">
              <div
                className="showcase-carousel"
                style={{ display: 'flex', gap: 'var(--space-lg)' }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} className="showcase-card" />
                ))}
              </div>
            </div>
          </div>
        ) : showcaseItems.length === 0 ? (
          <EmptyState message="No projects to show yet. Check back soon!" />
        ) : (
        <div className="showcase-carousel-wrapper">
          <button
            className="carousel-btn carousel-prev"
            onClick={() => scroll('left')}
            aria-label="Previous project"
            disabled={showcaseItems.length <= 1}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div 
            className="showcase-carousel-container"
            ref={containerRef}
          >
            <div
              className={`showcase-carousel ${isDragging ? 'is-dragging' : ''}`}
              ref={scrollRef}
              role="list"
              aria-label="Code and open source projects"
              style={{ 
                display: 'flex', 
                gap: 'var(--space-lg)', 
                willChange: 'transform',
                cursor: 'grab',
                transform: 'translate3d(0, 0, 0)'
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {showcaseItems.map((item, index) => (
                <div
                  key={item.title}
                  className="showcase-card animate-on-scroll"
                  role="listitem"
                  aria-label={item.title}
                  onClick={onCardClick}
                >
                  <div className="card-header">
                    <div className={`card-icon ${item.type}`}>
                      {item.type === 'github' ? (
                        <Code2 size={24} />
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
                        {item.type === 'medium' && item.meta.readTime && (
                          <span className="meta-item read-time">{item.meta.readTime}</span>
                        )}
                        {item.meta.date && (
                          <span className="meta-item date">{item.meta.date}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {item.thumbnail && (
                    <div className="card-thumbnail">
                      {item.type === 'github' ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={600}
                          height={400}
                          sizes="(max-width: 768px) 100vw, 400px"
                          loading="lazy"
                          className="card-thumbnail-img"
                        />
                      ) : (
                        <img src={item.thumbnail} alt={item.title} loading="lazy" />
                      )}
                    </div>
                  )}

                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>

                  <div className="card-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-footer"
                  >
                    <span className="link-text">
                      {item.type === 'github' ? 'View Repository' : 'Read Article'}
                    </span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn carousel-next"
            onClick={() => scroll('right')}
            aria-label="Next project"
            disabled={showcaseItems.length <= 1}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>
        )}

        {!isLoading && showcaseItems.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
