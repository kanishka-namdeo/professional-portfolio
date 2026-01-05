import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import Experience from '@/components/Experience';
import About from '@/components/About';
import SkillsAndEducation from '@/components/SkillsAndEducation';
import ContactFAQ from '@/components/ContactFAQ';
import StickyCTA from '@/components/StickyCTA';

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
          
          {/* Code & Open Source Section */}
          <Showcase />
          
          {/* Experience Section */}
          <Experience />
          
          {/* About Section */}
          <About />
          
          {/* Skills & Qualifications Section */}
          <SkillsAndEducation />
          
          {/* Contact Section */}
          <ContactFAQ />
        </article>
        
        {/* Sticky CTA */}
        <StickyCTA />
      </main>
    </>
  );
}
