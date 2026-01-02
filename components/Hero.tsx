'use client';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content-wrapper">
        <div className="hero-main-content animate-on-scroll">
          <p className="hero-main-line">MOST PMs TALK TO USERS</p>
          <p className="hero-main-line">MOST DEVs TALK TO MACHINES</p>
          <p className="hero-main-line hero-statement-highlight">I DO BOTH.</p>
        </div>
        <div className="hero-metrics-highlight animate-on-scroll animate-delay-1">
          <span className="metric-highlight-item"><strong>8x</strong> ARR Growth</span>
          <span className="metric-highlight-divider">|</span>
          <span className="metric-highlight-item"><strong>30K+</strong> Users</span>
          <span className="metric-highlight-divider">|</span>
          <span className="metric-highlight-item"><strong>50+</strong> Locations</span>
          <span className="metric-highlight-divider">|</span>
          <span className="metric-highlight-item"><strong>9+</strong> Years</span>
        </div>
        <div className="hero-availability-badge animate-on-scroll animate-delay-1">
          <span className="availability-dot"></span>
          Open to new roles
        </div>
        <div className="hero-actions animate-on-scroll animate-delay-2">
          <a href="#products" className="cta-button primary">My Projects</a>
          <a href="#contact-faq" className="cta-button secondary">Contact</a>
        </div>
      </div>
    </section>
  );
}
