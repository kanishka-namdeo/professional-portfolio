'use client';

export default function Hero() {
  return (
    <section id="hero" className="hero-section" role="banner" aria-label="Introduction">
      {/* Particle Mesh Animation Background */}
      <div className="particle-mesh-container" aria-hidden="true">
        <div className="particle-mesh">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <svg className="particle-mesh-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="10%" y1="20%" x2="30%" y2="30%" className="mesh-line" />
          <line x1="30%" y1="30%" x2="50%" y2="15%" className="mesh-line" />
          <line x1="50%" y1="15%" x2="60%" y2="40%" className="mesh-line" />
          <line x1="60%" y1="40%" x2="40%" y2="50%" className="mesh-line" />
          <line x1="40%" y1="50%" x2="15%" y2="50%" className="mesh-line" />
          <line x1="15%" y1="50%" x2="30%" y2="70%" className="mesh-line" />
          <line x1="30%" y1="70%" x2="70%" y2="60%" className="mesh-line" />
          <line x1="70%" y1="60%" x2="85%" y2="80%" className="mesh-line" />
          <line x1="85%" y1="80%" x2="50%" y2="85%" className="mesh-line" />
          <line x1="50%" y1="85%" x2="25%" y2="40%" className="mesh-line" />
          <line x1="25%" y1="40%" x2="50%" y2="40%" className="mesh-line" />
          <line x1="50%" y1="40%" x2="80%" y2="30%" className="mesh-line" />
        </svg>
      </div>
      
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
