'use client';

const certifications = [
  {
    title: 'Certified Scrum Product Owner (CSPO)',
    org: 'Scrum Alliance',
    date: 'November 2024',
    icon: '🏆',
  },
  {
    title: 'Autonomous Mobile Robots',
    org: 'EDX',
    date: 'Robot Perception, Locomotion, Localization and Planning',
    icon: '🤖',
  },
  {
    title: 'Advanced Robot Programmer',
    org: 'KUKA College',
    date: 'KRL Programming, SIMPRO Simulation',
    icon: '🦾',
  },
];

export default function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="certifications-title" className="section-title">Certifications</h2>
          <p className="section-subtitle">Professional certifications and training</p>
        </div>
        <div className="certs-grid" role="list">
          {certifications.map((cert, index) => (
            <div key={index} className={`cert-card animate-on-scroll ${index === 0 ? 'animate-delay-1' : index === 1 ? 'animate-delay-2' : 'animate-delay-3'}`} role="listitem">
              <div className="cert-badge" aria-hidden="true">{cert.icon}</div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-org">{cert.org}</p>
              <p className="cert-date">{cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
