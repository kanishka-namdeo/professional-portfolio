import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Showcase from '@/components/Showcase';
import About from '@/components/About';
import StickyCTA from '@/components/StickyCTA';
import BackToTop from '@/components/BackToTop';

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <main id="main-content" role="main">
        <article>
          {/* Screen reader only heading for SEO */}
          <h1 className="sr-only">Kanishka Namdeo - Product Manager Portfolio - Dubai, UAE</h1>
          
          {/* Hero Section */}
          <Hero />
          
          {/* Experience Section */}
          <Experience />
          
          {/* Code & Open Source Section */}
          <Showcase />
          
          {/* About & FAQ Section (Merged) */}
          <About />
        </article>
        
        {/* Sticky CTA */}
        <StickyCTA />
        
        {/* Back to Top Button */}
        <BackToTop />
      </main>
    </>
  );
}
