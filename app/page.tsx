import Hero from '@/components/Hero';
import About from '@/components/About';
import Showcase from '@/components/Showcase';
import Products from '@/components/Products';
import Experience from '@/components/Experience';
import SkillsAndEducation from '@/components/SkillsAndEducation';
import Press from '@/components/Press';
import ContactFAQ from '@/components/ContactFAQ';
import StickyCTA from '@/components/StickyCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Showcase />
      <Products />
      <Experience />
      <SkillsAndEducation />
      <Press />
      <ContactFAQ />
      <StickyCTA />
    </main>
  );
}
