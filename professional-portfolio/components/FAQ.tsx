'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "What have I built?",
    answer: `Ah, the million-dollar question! Here's what I've been up to over the years:
    • MoveInSync Business Travel Solution - My proudest work so far, helping grow ARR 8x and serving 30K+ users across 50+ locations
    • Spectre Modular Drone / UAV Control Software - Built India's first modular drone with a 50-minute endurance. Yes, I actually know how to fly things (sort of!)
    • In-plant Tracking System - Created IoT magic for warehouses. Still makes me happy thinking about it
    • Natural Language Processing MVP - NLP solution that boosted productivity 10x. The numbers don't lie!
    • Trashfin / Wasteshark Water Cleaning Drone - An autonomous drone that collects 350kg of garbage in 8 hours. Because someone had to clean up our oceans!
    • Wildlife Surveillance & Anti-Poaching System - Government-installed in Rajasthan's tiger reserves. Dream job material right there.`,
  },
  {
    question: "Where have I worked?",
    answer: `I've had the fortune of working with some brilliant teams across different industries:
    • Cognium (Jul 2025 - Oct 2025) - Building AI for wealth management. Short stint, but packed with learning!
    • MoveInSync (April 2022 - Present) - My current adventure in corporate mobility. Still here, still learning, still loving it
    • Flipr Innovation Labs (Oct 2024 - Jan 2025) - Consulting on video tech and dispute resolution. Fun challenge!
    • TekIP Knowledge Consulting (Dec 2020 - Apr 2022) - Led software teams and discovered my love for NLP/LLM
    • Intugine Technologies (Jun 2019 - Dec 2020) - My early PM days building a logistics platform. So much growth!
    • Medulla.AI (Jan 2019 - Jun 2019) - Healthcare AI. Fascinating space, even if I couldn't save the world (yet!)
    • Sagar Defence Engineering (Jun 2017 - Dec 2018) - Robotics engineering. Yes, I did build drones that actually flew!`,
  },
  {
    question: "How do I approach product management?",
    answer: `Great question! Here's my somewhat scatterbrained but effective process:
    • User Research - I talk to people. A lot. 20+ interviews before I even think about strategy. Your users are smarter than your assumptions!
    • 0-to-1 Strategy - I love building from nothing. Something magical happens when an idea becomes reality
    • Agile/Scrum - I run my teams like well-oiled machines. Sprints, standups, the whole circus!
    • Growth Focus - I've helped grow ARR 8x, onboarded 30K+ users, and expanded to 50+ locations. Numbers make me happy
    • Technical Foundation - I code (Python, MEAN Stack), I collaborate with engineers, and I actually understand what they're saying most of the time!`,
  },
  {
    question: "Where am I based?",
    answer: `Currently in Dubai, UAE - enjoying the sunshine and the chaos of building products in the Middle East!
    
    Before this, I worked with teams across India, Philippines, and South Africa. So I've learned to handle time zones better than I handle my sleep schedule.`,
  },
  {
    question: "What industries have I worked in?",
    answer: `I've been around the block a few times! Here's my tour of industries:
    • Mobility - Corporate transportation and fleet management. Cars are cool, actually
    • SaaS - B2B platforms and enterprise software. I've seen some things
    • Robotics - Autonomous systems, UAVs, USVs. Basically, I build things that move without humans driving
    • AI/LLM - NLP, AI wealth platforms, ML analytics. The future is now, people!
    • Healthcare AI - Predictive analytics in healthcare. Saved my cynicism, at least
    • Logistics - Supply chain and enterprise logistics. Boxes and routes. Someone has to care!
    • Wealth Tech - AI-driven investment platforms. Making money talk, literally`,
  },
  {
    question: "How can we work together?",
    answer: `I'd love to hear from you! Here's how we can make magic happen:
    • Email - kanishkanamdeo@hotmail.com - I read everything, eventually!
    • LinkedIn - Let's connect professionally
    
    I'm always open to discussing product leadership roles, consulting opportunities, and cool projects in mobility, SaaS, and AI. Send me your wildest ideas - I promise I won't judge (much)!`,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section section-full-width" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Common questions about my work and expertise</p>
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {item.question}
              </button>
              <div 
                id={`faq-answer-${index}`} 
                className="faq-answer"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="faq-answer-content" id={`faq-question-${index}`}>
                  {item.answer.split('\n').map((line, lineIndex) => {
                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                      return (
                        <p key={lineIndex} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {line.trim().substring(2)}
                        </p>
                      );
                    }
                    return <p key={lineIndex}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
