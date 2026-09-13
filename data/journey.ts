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
export interface Era {
  id: 'origin' | 'logistics' | 'language' | 'mobility' | 'agents';
  number: string;
  company: string;
  role: string;
  period: string;
  coords: { x: number; y: number }; // % position on the map, origin bottom-left → agents top-right
  terrain: string; // the challenge
  crossing: string; // what I did
  summit: string; // the impact
  metrics: EraMetric[];
  press?: PressMention[];
}

export const eras: Era[] = [
  {
    id: 'origin',
    number: '01',
    company: 'Sagar Defence Engineering',
    role: 'Co-founding member & CTO',
    period: '2016 — 2020',
    coords: { x: 12, y: 88 },
    terrain:
      'Defence and paramilitary agencies needed unmanned surface vehicles that could hold a course in real sea conditions — no operator, no second chances.',
    crossing:
      'I co-founded the engineering effort: autonomous navigation with multi-sensor fusion, obstacle avoidance, simulation environments to rehearse missions before launch, and field trials with defence and industrial partners.',
    summit:
      'Our USVs completed successful field trials — systems I architected were deployed for wildlife surveillance and water-body cleaning pilots covered by The Hindu and Mumbai Mirror.',
    metrics: [
      { value: 4, suffix: ' yrs', label: 'at sea' },
      { value: 6, label: 'sensor streams fused' },
    ],
    press: [
      { source: 'The Hindu', headline: 'State Embraces Startups, Signs Pacts for Works Worth 15 Lakh', url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece', date: '2018' },
      { source: 'Mumbai Mirror', headline: 'Welcome TrashFin — The Water Bodies Cleaner', url: 'https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.html', date: '2018' },
      { source: 'Naya Rajasthan', headline: 'Wildlife Surveillance and Anti-Poaching System Installed by Rajasthan Government', url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/', date: 'Jun 2018' },
    ],
  },
  {
    id: 'logistics',
    number: '02',
    company: 'Intugine Technologies',
    role: 'Technical Consultant',
    period: '2020',
    coords: { x: 30, y: 72 },
    terrain:
      'Enterprise logistics teams flew blind across road, rail and air — three transport modes, three fragmented views, decisions made late.',
    crossing:
      'I led the multimodal visibility platform: sharper tracking accuracy across all modes, real-time dashboards and alerting, and the requirements discipline that got enterprise clients to actually adopt it.',
    summit:
      'Enterprise teams could finally decide in real time across every transport mode — adoption grew because the platform fit their workflows instead of adding one.',
    metrics: [
      { value: 3, label: 'transport modes unified' },
      { value: 24, suffix: '/7', label: 'real-time visibility' },
    ],
  },
  {
    id: 'language',
    number: '03',
    company: 'Medulla.AI · TekIP',
    role: 'Senior Technical Consultant · Software Team Lead',
    period: '2020 — 2022',
    coords: { x: 45, y: 58 },
    terrain:
      'Patent analysts spent hours in databases; loan officers reviewed pay stubs and tax returns by hand. Two industries, one disease: unstructured language at scale.',
    crossing:
      'I led a 6-developer team across 5 enterprise projects, shipped 40+ features, launched an NLP patent-analysis product on LLMs, and built an automated loan pipeline on Amazon Textract with confidence scoring, Celery async processing and Airflow orchestration.',
    summit:
      'Patent analysis productivity rose 10×. Loan document analysis dropped to a fifth of manual time — with audit logging, PII encryption and fallback workflows that regulators accept.',
    metrics: [
      { value: 10, suffix: '×', label: 'analysis productivity' },
      { value: 5, suffix: '×', label: 'faster document review' },
      { value: 40, suffix: '+', label: 'features shipped' },
    ],
  },
  {
    id: 'mobility',
    number: '04',
    company: 'MoveInSync',
    role: 'Senior Product Manager',
    period: '2022 — 2024',
    coords: { x: 62, y: 40 },
    terrain:
      'The world’s largest enterprise transport platform needed to grow from a regional success into a global one — without breaking product quality along the way.',
    crossing:
      'I owned product vision and roadmap: 70+ new locations across 3 countries, a rebuilt mobile experience, native payments and invoicing, ERP integrations that cut implementation time 40%, and an 8-person sprint team run on ruthless prioritization.',
    summit:
      '~10× ARR growth. 70,000+ monthly users. 15+ enterprise clients onboarded. The platform became the market leader in enterprise transport management.',
    metrics: [
      { value: 10, suffix: '×', label: 'ARR' },
      { value: 70, suffix: 'K+', label: 'monthly users' },
      { value: 70, suffix: '+', label: 'locations' },
      { value: 3, label: 'countries' },
    ],
    press: [
      { source: 'Impakter', headline: 'Indian Startup MoveInSync Pioneers Intelligent Commutes Across the Globe', url: 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/', date: '2024' },
      { source: 'MoveInSync', headline: 'Business RentLZ — Enterprise Vehicle Management Solution', url: 'https://moveinsync.com/business-rentlz', date: '2024' },
    ],
  },
  {
    id: 'agents',
    number: '05',
    company: 'AvloAI · Independent consulting',
    role: 'Product & AI Consultant',
    period: '2025 — present',
    coords: { x: 84, y: 16 },
    terrain:
      'Founders keep building AI products users don’t need. The gap is not models — it is product judgment: what to build, for whom, and what to verify before writing code.',
    crossing:
      'I architected a 5-agent children’s storytelling pipeline (22 natively-written languages, 30-second ElevenLabs voice cloning, COPPA 2.0 data architecture). At Cognium I ran 20+ user interviews and secured the first beta customer before the prototype existed. In the open, I build the MCP tooling this site documents.',
    summit:
      'Thousands of families generate personalized stories in their own languages. A wealth-management platform found product-market signal before writing production code. The base camps below are the receipts.',
    metrics: [
      { value: 22, label: 'languages' },
      { value: 30, suffix: 's', label: 'voice cloning' },
      { value: 5, label: 'agent pipeline' },
      { value: 20, suffix: '+', label: 'user interviews' },
    ],
  },
];
