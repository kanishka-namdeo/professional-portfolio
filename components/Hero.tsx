'use client';

export default function Hero() {
  return (
    <section id="hero" className="hero-section" role="banner" aria-label="Introduction">
      <div className="container">
        <div className="hero-content-wrapper">
          <div className="hero-main-content animate-on-scroll" role="status" aria-live="polite">
            <p className="hero-main-line">MOST PMs TALK TO USERS</p>
            <p className="hero-main-line">MOST DEVs TALK TO MACHINES</p>
            <p className="hero-main-line hero-statement-highlight">I DO BOTH.</p>
          </div>
          <div className="hero-metrics-highlight animate-on-scroll animate-delay-1" role="list" aria-label="Key achievements">
            <span className="metric-highlight-item" role="listitem"><strong>8x</strong> ARR Growth</span>
            <span className="metric-highlight-divider" aria-hidden="true">|</span>
            <span className="metric-highlight-item" role="listitem"><strong>30K+</strong> Users</span>
            <span className="metric-highlight-divider" aria-hidden="true">|</span>
            <span className="metric-highlight-item" role="listitem"><strong>50+</strong> Locations</span>
            <span className="metric-highlight-divider" aria-hidden="true">|</span>
            <span className="metric-highlight-item" role="listitem"><strong>9+</strong> Years</span>
          </div>
          <div className="hero-availability-badge animate-on-scroll animate-delay-1" role="status" aria-label="Availability status">
            <span className="availability-dot" aria-hidden="true"></span>
            Open to new roles
          </div>
          <nav className="hero-actions animate-on-scroll animate-delay-2" aria-label="Quick links">
            <a href="#products" className="cta-button primary">My Projects</a>
            <a href="#contact" className="cta-button secondary">Contact</a>
          </nav>
        </div>
      </div>
    </section>
  );
}
