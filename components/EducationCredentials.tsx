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

const education = [
  {
    degree: 'Bachelor of Engineering',
    school: 'UIT-RGPV',
    date: 'Mechanical Engineering • June 2015',
  },
];

export default function EducationCredentials() {
  return (
    <section id="education-credentials" className="section-full-width" aria-labelledby="education-credentials-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="education-credentials-title" className="section-title">Education & Credentials</h2>
          <p className="section-subtitle">Academic background and professional certifications</p>
        </div>
        
        <div className="credentials-layout">
          <div className="credentials-column credentials-education">
            <h3 className="credentials-subtitle">Education</h3>
            <div className="education-cards">
              {education.map((edu, index) => (
                <div key={index} className={`education-card animate-on-scroll ${index === 0 ? 'animate-delay-1' : ''}`}>
                  <h4 className="education-degree">{edu.degree}</h4>
                  <p className="education-school">{edu.school}</p>
                  <p className="education-date">{edu.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="credentials-column credentials-certifications">
            <h3 className="credentials-subtitle">Certifications</h3>
            <div className="certs-grid" role="list">
              {certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`cert-card animate-on-scroll ${index === 0 ? 'animate-delay-1' : index === 1 ? 'animate-delay-2' : 'animate-delay-3'}`} 
                  role="listitem"
                >
                  <div className="cert-badge" aria-hidden="true">{cert.icon}</div>
                  <h4 className="cert-title">{cert.title}</h4>
                  <p className="cert-org">{cert.org}</p>
                  <p className="cert-date">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
