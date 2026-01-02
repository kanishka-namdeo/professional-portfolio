'use client';

export default function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info animate-on-scroll">
            <div className="section-header">
              <h2 id="contact-title" className="section-title">Get In Touch</h2>
              <p className="section-subtitle">Let&apos;s discuss how we can work together</p>
            </div>
            <a href="mailto:kanishkanamdeo@hotmail.com" className="contact-item" aria-label="Send email to Kanishka">
              <div className="contact-item-icon" aria-hidden="true">✉️</div>
              <div className="contact-item-content">
                <h4>Email</h4>
                <span>kanishkanamdeo@hotmail.com</span>
              </div>
            </a>
            <a href="#" className="contact-item" aria-label="Connect on LinkedIn">
              <div className="contact-item-icon" aria-hidden="true">💼</div>
              <div className="contact-item-content">
                <h4>LinkedIn</h4>
                <span>Connect with me</span>
              </div>
            </a>
            <a href="#" className="contact-item" aria-label="View location">
              <div className="contact-item-icon" aria-hidden="true">📍</div>
              <div className="contact-item-content">
                <h4>Location</h4>
                <span>Dubai, UAE</span>
              </div>
            </a>
          </div>
          <div className="contact-cta animate-on-scroll animate-delay-1">
            <h3>Ready to build something great?</h3>
            <p>Whether you&apos;re looking for a product leader to drive your next initiative or want to discuss potential collaboration, I&apos;d love to hear from you.</p>
            <a href="mailto:kanishkanamdeo@hotmail.com" className="btn btn-primary">Send Me an Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}
