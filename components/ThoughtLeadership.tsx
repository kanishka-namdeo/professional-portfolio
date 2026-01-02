'use client';

export default function ThoughtLeadership() {
  return (
    <section id="thought-leadership" aria-labelledby="thought-leadership-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="thought-leadership-title" className="section-title">What I'm Thinking About</h2>
          <p className="section-subtitle">Reflections on product, technology, and building better products</p>
        </div>
        
        <div className="thought-grid">
          <div className="thought-card animate-on-scroll">
            <div className="thought-icon">🤖</div>
            <h3 className="thought-title">The PM's Guide to AI Implementation</h3>
            <p className="thought-excerpt">
              Most AI products fail not because the technology isn't capable, but because PMs don't understand 
              what they're actually selling. Here's a framework for positioning AI products that actually resonate.
            </p>
            <a href="#" className="thought-link">Read Article →</a>
          </div>
          
          <div className="thought-card animate-on-scroll animate-delay-1">
            <div className="thought-icon">📊</div>
            <h3 className="thought-title">Metrics That Actually Matter</h3>
            <p className="thought-excerpt">
              We optimize for vanity metrics until they become our downfall. After driving 8x ARR growth, 
              here's what I learned about measuring what truly moves the needle.
            </p>
            <a href="#" className="thought-link">Read Article →</a>
          </div>
          
          <div className="thought-card animate-on-scroll animate-delay-2">
            <div className="thought-icon">🔧</div>
            <h3 className="thought-title">Why Technical PMs Win</h3>
            <p className="thought-excerpt">
              Coming from robotics engineering into product management gave me an unfair advantage. 
              Here's how your technical background can become your biggest asset.
            </p>
            <a href="#" className="thought-link">Read Article →</a>
          </div>
        </div>
        
        <div className="thought-cta animate-on-scroll">
          <p>More on <a href="https://kanishkanamdeo.medium.com/" target="_blank" rel="noopener noreferrer">Medium</a> →</p>
        </div>
      </div>
    </section>
  );
}
