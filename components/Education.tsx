'use client';

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="education-title" className="section-title">Education</h2>
          <p className="section-subtitle">Academic background</p>
        </div>
        <div className="education-grid">
          <div className="education-card animate-on-scroll">
            <h3 className="education-degree">Bachelor of Engineering</h3>
            <p className="education-school">UIT-RGPV</p>
            <p className="education-date">Mechanical Engineering • June 2015</p>
          </div>
        </div>
      </div>
    </section>
  );
}
