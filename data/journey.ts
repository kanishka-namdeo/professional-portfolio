// data/journey.ts
export interface EraMetric {
  value: number;
  suffix?: string;
  label: string;
}
export interface PressMention {
  source: string;
  headline: string;
  url: string;
  date: string;
}
export interface EraTestimonial {
  quote: string;
  name: string;
  title: string;
}
export interface EraCaseStudy {
  href: '/case-study-rentlz.html';
  label: string;
}
export interface Era {
  id: 'origin' | 'logistics' | 'language' | 'mobility' | 'agents';
  number: string;
  company: string;
  /** Short label for the map waypoint chips — keeps the trail navigable without collisions. */
  short: string;
  role: string;
  period: string;
  coords: { x: number; y: number }; // % position on the map, origin bottom-left → agents top-right
  terrain: string; // the challenge
  crossing: string; // what I did
  summit: string; // the impact
  metrics: EraMetric[];
  press?: PressMention[];
  testimonial?: EraTestimonial;
  caseStudy?: EraCaseStudy;
}

export const eras: Era[] = [
  {
    id: 'origin',
    number: '01',
    company: 'Sagar Defence Engineering',
    short: 'Sagar Defence',
    role: 'Co-founding member & CTO',
    period: '2016 — 2020',
    coords: { x: 7, y: 91 },
    terrain:
      'Defence and paramilitary agencies needed unmanned surface vehicles that could hold a course in real sea conditions — no operator, no second chances.',
    crossing:
      'I co-founded the engineering effort: autonomous navigation with multi-sensor fusion, obstacle avoidance, simulation environments to rehearse missions before launch, and field trials with defence and industrial partners.',
    summit:
      'Our USVs completed field trials — systems I architected were deployed for wildlife surveillance and water-body cleaning pilots covered by The Hindu and Mumbai Mirror.',
    metrics: [
      { value: 4, suffix: ' yrs', label: 'at sea' },
      { value: 6, label: 'sensor streams fused' },
    ],
    press: [
      { source: 'Deccan Chronicle', headline: 'Dr. Kiran Kumar, Chairman, ISRO receives IESA Technovation Sarabhai Award', url: 'https://www.deccanchronicle.com/technology/in-other-news/220217/dr-kiran-kumar-chairman-isro-receives-iesa-technovation-sarabhai-award.html', date: 'Feb 2017' },
      { source: 'The Hindu', headline: 'State Embraces Startups, Signs Pacts for Works Worth 15 Lakh', url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece', date: 'Jun 2018' },
      { source: 'Mumbai Mirror', headline: 'Welcome TrashFin — The Water Bodies Cleaner', url: 'https://web.archive.org/web/20180707023941/https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.cms', date: 'Jul 2018' },
      { source: 'Naya Rajasthan', headline: 'Wildlife Surveillance and Anti-Poaching System Installed by Rajasthan Government', url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/', date: 'Jun 2018' },
      { source: 'Yo Vizag', headline: 'Andhra Pradesh Innovation Society backed start-ups gear up for Slush 2018', url: 'https://www.yovizag.com/andhra-pradesh-innovation-society-slush-2018/', date: 'Nov 2018' },
      { source: 'YourStory', headline: 'At Maharashtra Startup Week, discover why B2G projects are a win-win for startups and state government', url: 'https://yourstory.com/2018/12/maharashtra-startup-week-discover-b2g-projects', date: 'Dec 2018' },
    ],
  },
  {
    id: 'logistics',
    number: '02',
    company: 'Intugine Technologies',
    short: 'Intugine',
    role: 'Technical Consultant',
    period: '2020',
    coords: { x: 26, y: 73 },
    terrain:
      'Enterprise logistics teams flew blind across road, rail and air — three transport modes, three fragmented views, decisions made late.',
    crossing:
      'I led the multimodal visibility platform: tracking across all three modes, real-time dashboards and alerting, and the requirements work that got enterprise clients to adopt it.',
    summit:
      'Enterprise teams decided in real time across every transport mode; adoption grew because the platform fit their workflows instead of adding another.',
    metrics: [
      { value: 3, label: 'transport modes unified' },
      { value: 24, suffix: '/7', label: 'real-time visibility' },
    ],
    press: [
      { source: 'YourStory', headline: 'Coronavirus: Startup Intugine Technologies helping states track quarantine zones', url: 'https://yourstory.com/2020/04/coronavirus-startup-intugine-technologies-helping-', date: 'Apr 2020' },
      { source: 'Inc42', headline: '10 Indian Startups Fighting Covid-19 Pandemic With Cutting-Edge Tech', url: 'https://inc42.com/features/the-crusaders-10-indian-startups-fighting-the-pandemic-with-cutting-edge-tech/', date: 'Apr 2020' },
    ],
  },
  {
    id: 'language',
    number: '03',
    company: 'Medulla.AI · TekIP',
    short: 'Medulla.AI',
    role: 'Senior Technical Consultant · Software Team Lead',
    period: '2020 — 2022',
    coords: { x: 46, y: 56 },
    terrain:
      'Patent analysts spent hours in databases; loan officers reviewed pay stubs and tax returns by hand. Two industries with the same problem: unstructured language.',
    crossing:
      'I led a 6-developer team across 5 enterprise projects, shipped 30+ features, launched a patent-landscape analysis tool built on BERT embeddings and vector similarity search, and built an automated loan pipeline on Amazon Textract with confidence scoring, Celery async processing and Airflow orchestration.',
    summit:
      'Patent analysis productivity rose 10×. Loan document analysis dropped to a fifth of manual time — with audit logging, PII encryption and fallback workflows that regulators accept.',
    metrics: [
      { value: 10, suffix: '×', label: 'analysis productivity' },
      { value: 5, suffix: '×', label: 'faster document review' },
      { value: 30, suffix: '+', label: 'features shipped' },
    ],
  },
  {
    id: 'mobility',
    number: '04',
    company: 'MoveInSync',
    short: 'MoveInSync',
    role: 'Senior Product Manager',
    period: '2022 — 2024',
    coords: { x: 66, y: 37 },
    terrain:
      'The enterprise transport platform needed to grow from a regional success into a global one without breaking product quality.',
    crossing:
      'I owned product vision and roadmap: 50+ new locations across 3 countries, a rebuilt mobile experience, native payments and invoicing, ERP integrations that cut implementation time 20%, and an 8-person sprint team.',
    summit:
      '8× ARR growth. 70,000+ monthly users. 15+ enterprise clients onboarded across international markets — India, the Philippines and South Africa.',
    metrics: [
      { value: 8, suffix: '×', label: 'ARR' },
      { value: 70, suffix: 'K+', label: 'monthly users' },
      { value: 50, suffix: '+', label: 'locations' },
      { value: 3, label: 'countries' },
    ],
    press: [
      { source: 'Mobility Outlook', headline: 'How MoveInSync Is Redefining Corporate Transport In India', url: 'https://www.mobilityoutlook.com/features/how-moveinsync-is-redefining-corporate-transport-in-india/', date: 'Oct 2023' },
      { source: 'TechCrunch', headline: "India's MoveInSync eyes $50-60M in fresh funding", url: 'https://techcrunch.com/2023-12-03/moveinsync-funding/', date: 'Dec 2023' },
      { source: 'Bessemer Venture Partners', headline: 'Making the daily commute more convenient for every employee: Why we invested in MoveInSync', url: 'https://www.bvp.com/news/making-the-daily-commute-more-convenient-for-every-employee-why-we-invested-in-moveinsync', date: 'Jan 2024' },
      { source: 'YourStory', headline: 'Employee commute platform MoveInSync bags $15M from Bessemer Venture Partners', url: 'https://yourstory.com/2024/01/employee-commute-platform-moveinsync-raises-15-million-bessemer-venture', date: 'Jan 2024' },
      { source: 'Impakter', headline: 'Indian Startup MoveInSync Pioneers Intelligent Commutes Across the Globe', url: 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/', date: '2024' },
      { source: 'MoveInSync', headline: 'Business RentLZ — Enterprise Vehicle Management Solution', url: 'https://moveinsync.com/business-rentlz', date: '2024' },
    ],
    testimonial: {
      quote:
        'MoveInSync manages Wipro’s employee transportation across 8 cities. We chose them for their app’s ability to ensure employee safety and security, operational transparency, and cost efficiency, replacing our previous manual management approach.',
      name: 'Nittan Bhalla',
      title: 'Senior VP & Global Head - Workplace Operations, Wipro',
    },
    caseStudy: {
      href: '/case-study-rentlz.html',
      label: 'Read the full RentLz case study',
    },
  },
  {
    id: 'agents',
    number: '05',
    company: 'Flipr · Cognium · AvloAI',
    short: 'Consulting',
    role: 'Product Consultant · Senior PM · Product & AI Consultant',
    period: '2024 — present',
    coords: { x: 91, y: 12 },
    terrain:
      'Founders keep building AI products users don’t need. The missing piece is product judgment: what to build, for whom, and what to verify before writing code.',
    crossing:
      'Three engagements, back to back. Flipr hired me to scope and ship a video-retrieval MVP for Flipkart — automated dispute resolution wired into their Order Management System, built for ~50K daily orders. At Cognium in Dubai I was Senior PM on an AI-native wealth platform: 20+ user interviews, LLM guardrails, and the first beta customer secured before the prototype existed. Since January 2026 I’ve owned product and architecture at AvloAI, a children’s storytelling platform.',
    summit:
      '2,000+ families generate personalized stories in their own languages at AvloAI. Flipkart’s dispute teams got a working MVP on schedule. A wealth-management platform found product-market signal before writing production code. The base camps below are the receipts.',
    metrics: [
      { value: 50, suffix: 'K', label: 'daily orders through the Flipr MVP' },
      { value: 20, suffix: '+', label: 'Cognium user interviews' },
      { value: 22, label: 'AvloAI languages' },
      { value: 30, suffix: 's', label: 'voice cloning' },
    ],
  },
];
