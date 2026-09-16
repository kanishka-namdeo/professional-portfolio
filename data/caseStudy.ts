// data/caseStudy.ts
// Full text of the MoveInSync RentLz case study, as structured data so the
// dossier can be rendered twice — as an in-page overlay on the trail and as
// the standalone /case-study/rentlz route — without the copies drifting.
//
// Number canon (see data/AGENTS.md): "70K+ monthly users" is total MAU; the
// acquisition figure is "30K+ new users onboarded" via client onboarding.

export interface CaseStudyMeta {
  label: string;
  value: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyQuote {
  text: string;
  name: string;
  title: string;
}

export interface CaseStudyFeature {
  title: string;
  detail: string;
}

export interface CaseStudyStep {
  period: string;
  title: string;
  detail: string;
}

export interface CaseStudyLesson {
  title: string;
  detail: string;
}

/** A section body is an ordered list of blocks; the renderer maps each kind to its own layout. */
export type CaseStudyBlock =
  | { kind: 'p'; text: string } // **bold** spans are parsed by the renderer
  | { kind: 'metrics'; items: CaseStudyMetric[] }
  | { kind: 'features'; items: CaseStudyFeature[] }
  | { kind: 'quote'; quote: CaseStudyQuote }
  | { kind: 'steps'; items: CaseStudyStep[] }
  | { kind: 'lessons'; items: CaseStudyLesson[] };

export interface CaseStudySection {
  heading: string;
  blocks: CaseStudyBlock[];
}

export interface CaseStudyDoc {
  slug: string;
  /** Mono eyebrow above the title, e.g. "Field dossier · Waypoint 04". */
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: CaseStudyMeta[];
  sections: CaseStudySection[];
  closing: string;
}

export const rentlzCaseStudy: CaseStudyDoc = {
  slug: 'rentlz',
  eyebrow: 'Field dossier · Waypoint 04',
  title: 'Scaling corporate mobility: how MoveInSync RentLz reached 8× ARR',
  subtitle:
    'A deep dive into turning a fragmented corporate car rental service into a SaaS platform serving 70,000+ monthly users across 50+ locations in three countries.',
  meta: [
    { label: 'Product', value: 'MoveInSync RentLz' },
    { label: 'Role', value: 'Senior Product Manager' },
    { label: 'Timeline', value: 'Apr 2022 — Oct 2024' },
    { label: 'Impact', value: '8× ARR · 12× usage' },
  ],
  sections: [
    {
      heading: 'Executive summary',
      blocks: [
        {
          kind: 'p',
          text: 'MoveInSync RentLz started from a plain observation: enterprises ran corporate transportation on phone calls, paper logs, and disconnected vendors. As the Senior Product Manager for this vertical, I turned that service-heavy offering into a SaaS platform — the system of record for bookings, billing, and fleet operations.',
        },
        {
          kind: 'p',
          text: 'The numbers moved over my 2.5-year tenure: **8× Annual Recurring Revenue (ARR)**, **12× product usage**, and **15+ enterprise clients** onboarded, taking the platform to **70,000+ monthly active users** across **50+ locations** in India, the Philippines, and South Africa. Client onboarding alone added **30,000+ new monthly users**. Operationally, the platform cut client implementation time by **20%** and support ticket volume by **15%**.',
        },
        {
          kind: 'metrics',
          items: [
            { value: '8×', label: 'ARR growth' },
            { value: '12×', label: 'Product usage increase' },
            { value: '30K+', label: 'New users onboarded' },
            { value: '50+', label: 'Global locations' },
          ],
        },
      ],
    },
    {
      heading: 'The terrain: problem & market opportunity',
      blocks: [
        {
          kind: 'p',
          text: 'The corporate car rental market in India and emerging economies presented a significant operational headache for enterprise transport managers. Traditional approaches relied heavily on manual processes: phone calls for bookings, paper logs for tracking, and spreadsheets for expense reconciliation. This fragmentation created three persistent pain points that affected organizations at scale.',
        },
        {
          kind: 'p',
          text: '**Visibility deficits:** transport managers lacked real-time insight into vehicle locations, driver assignments, and trip status. When an executive needed to know why their airport transfer was delayed, the answer required phone calls across multiple vendors with no centralized source of truth. This opacity extended to cost tracking, where monthly invoices arrived with line items that were nearly impossible to audit or optimize.',
        },
        {
          kind: 'p',
          text: '**Vendor fragmentation:** large enterprises typically engaged 5–10 different fleet providers across regions, each with their own booking interfaces, billing formats, and service standards. For a company operating across 25+ cities, this meant maintaining relationships with dozens of vendor contacts while trying to enforce consistent service quality. The operational overhead was substantial, and bargaining power remained diluted across disconnected partnerships.',
        },
        {
          kind: 'p',
          text: '**Employee experience gaps:** the business travelers themselves — executives, sales teams, senior management — experienced the friction most directly. Booking required navigating corporate travel policies, tracking relied on SMS updates from drivers, and communication often meant exchanging personal phone numbers. For organizations emphasizing employee safety and security, this informal coordination represented a significant compliance gap.',
        },
        {
          kind: 'quote',
          quote: {
            text: 'MoveInSync manages Wipro’s employee transportation across 8 cities. We chose them for their app’s ability to ensure employee safety and security, operational transparency, and cost efficiency, replacing our previous manual management approach.',
            name: 'Nittan Bhalla',
            title: 'Senior VP & Global Head — Workplace Operations, Wipro',
          },
        },
        {
          kind: 'p',
          text: 'The market opportunity was clear: enterprises were spending significantly on corporate transportation but lacked the tools to manage this spend intelligently. Research indicated that optimized fleet management could yield **20%+ cost reductions** while simultaneously improving employee satisfaction scores. The challenge was building a platform capable of delivering these outcomes across the complexity of enterprise requirements.',
        },
      ],
    },
    {
      heading: 'The route: product vision & strategy',
      blocks: [
        {
          kind: 'p',
          text: "My approach to defining RentLz's product vision centered on a fundamental principle: we weren't building a better booking interface; we were creating an operating system for corporate mobility. This distinction guided every subsequent decision, from feature prioritization to technical architecture.",
        },
        {
          kind: 'p',
          text: '**The three pillars:** I structured the product roadmap around three non-negotiable pillars that would define success. First, *Reliability* meant that every booking, every driver assignment, and every trip completion would happen consistently, without exception. Second, *Visibility* ensured that stakeholders at every level — from transport managers to CFOs — had access to the information they needed, when they needed it. Third, *Cost Control* delivered the financial intelligence necessary to optimize transportation spend and demonstrate ROI.',
        },
        {
          kind: 'p',
          text: '**From service to SaaS:** the initial RentLz offering was service-heavy, relying heavily on MoveInSync\u2019s operational team to manage vendor relationships and coordinate trips. My strategic shift involved transitioning to a SaaS model where the platform itself became the primary interface. This meant investing heavily in vendor onboarding workflows, automated assignment algorithms, and self-service capabilities for both enterprise admins and individual employees.',
        },
        {
          kind: 'p',
          text: '**Phased roadmap:** I established a three-phase roadmap that balanced immediate revenue opportunities with long-term platform differentiation. Phase 1 focused on core booking and tracking capabilities, the minimum viable product that could demonstrate value to early adopters. Phase 2 introduced advanced features including automated billing, ERP integration, and the VoIP communication system. Phase 3 addressed scalability: multi-location support, advanced analytics, and AI-driven optimization.',
        },
      ],
    },
    {
      heading: 'What was built: key features & the development journey',
      blocks: [
        {
          kind: 'p',
          text: 'Each major feature in RentLz emerged from specific customer pain points identified through extensive discovery work. I conducted over 50 user interviews with transport managers, travel coordinators, and frequent business travelers to understand their daily challenges and translate them into product requirements.',
        },
        {
          kind: 'features',
          items: [
            {
              title: 'Intelligent booking engine',
              detail:
                'A unified interface supporting airport transfers, intercity travel, and intracity commutes with automated vendor assignment based on company policies, location, and vehicle preferences.',
            },
            {
              title: 'AI-powered safety monitoring',
              detail:
                'Real-time telematics integration detecting risky driving behaviors, with automated alerts and incident reporting to ensure employee safety across all trips.',
            },
            {
              title: 'VoIP communication layer',
              detail:
                'Privacy-preserving voice communication between employees and drivers without phone number exchange, achieving **70% adoption** among active users.',
            },
            {
              title: 'Automated billing & invoicing',
              detail:
                'End-to-end financial workflow from trip completion to invoice generation, with support for corporate cards, vendor payments, and ERP integration.',
            },
            {
              title: 'Executive dashboards',
              detail:
                'Real-time analytics on transportation spend, utilization rates, and service quality metrics, enabling data-driven decisions on fleet policy optimization.',
            },
            {
              title: 'Universal API gateway',
              detail:
                'Standardized interfaces enabling integration with fleet management systems, HR platforms, and external ERP solutions, reducing implementation time by **20%**.',
            },
          ],
        },
        {
          kind: 'p',
          text: 'The VoIP feature deserves particular attention because it solved a problem that customers hadn\u2019t explicitly articulated. During user research, I discovered that employees frequently declined trips or requested changes because they were uncomfortable sharing personal phone numbers with drivers. By implementing in-app voice calling that masked actual phone numbers, we eliminated this friction point entirely. The **70% adoption rate** within three months of launch validated our hypothesis.',
        },
        {
          kind: 'p',
          text: 'Similarly, the universal API gateway emerged from a specific challenge: each new client implementation required custom integration work with their existing fleet providers. By standardizing data formats and communication protocols, we created a plug-and-play architecture that could onboard fleet vendors in days rather than weeks. This directly contributed to the **20% reduction in implementation time** and enabled our rapid expansion to **50+ locations** across three countries.',
        },
      ],
    },
    {
      heading: 'Under the hood: technical implementation',
      blocks: [
        {
          kind: 'p',
          text: 'Building a platform capable of handling 70,000+ monthly users across 50+ global locations required careful architectural decisions. I worked closely with engineering leadership to establish a cloud-native infrastructure that prioritized scalability, reliability, and security — particularly important given enterprise compliance requirements.',
        },
        {
          kind: 'p',
          text: '**Mobile-first architecture:** recognizing that 80%+ of end-user interactions would occur through mobile devices, I championed a mobile-first development approach. The employee app prioritized speed and simplicity, with key actions accessible in under three taps. The driver app focused on efficiency, minimizing the cognitive load on chauffeurs already managing complex schedules. Transport manager dashboards provided administrative capabilities on larger screens while maintaining responsive design principles.',
        },
        {
          kind: 'p',
          text: '**API-first integration strategy:** rather than building point-to-point integrations with each fleet provider, we developed a universal API gateway that normalized data across vendors. This abstraction layer allowed us to onboard new fleet partners by configuring translation rules rather than rewriting core logic. The gateway also enabled our **5+ fleet provider integrations** controlling **75% of vehicles** in the network — a depth of integration a competitor would have to rebuild one vendor at a time.',
        },
        {
          kind: 'p',
          text: '**Security & compliance:** enterprise-grade security was non-negotiable for our target market. I worked with the security team to achieve ISO 27001, ISO 27701, and SOC 2 Type 2 certifications, addressing the concerns of Fortune 500 companies evaluating our platform. Data encryption at rest and in transit, role-based access control, and comprehensive audit logging became table stakes for enterprise deals.',
        },
      ],
    },
    {
      heading: 'Getting to market: go-to-market strategy',
      blocks: [
        {
          kind: 'p',
          text: 'Launching a B2B enterprise product requires careful sequencing of sales enablement, marketing, and customer success activities. I built the GTM plan on MoveInSync\u2019s existing enterprise relationships while giving RentLz its own position in the market.',
        },
        {
          kind: 'p',
          text: '**Land-and-expand motion:** rather than pursuing large enterprise deals from cold outreach, I identified opportunities within MoveInSync\u2019s existing customer base. Companies already using our employee transportation product had expressed interest in a more comprehensive corporate rental solution. This reduced sales cycles significantly and provided instant credibility. We weren\u2019t an unknown startup making promises — we were an existing partner offering an expanded solution.',
        },
        {
          kind: 'p',
          text: '**Pilot program structure:** for new prospects, I designed a structured pilot program that reduced evaluation risk while demonstrating value quickly. Pilots ran for 60 days with focused success metrics: booking completion rate, employee adoption percentage, and positive feedback score. This approach enabled us to **onboard 8 new clients in FY 2022–23** alone, with each pilot converting to a full deployment upon meeting success criteria.',
        },
        {
          kind: 'p',
          text: '**Sales enablement:** I established monthly product demo sessions for the Customer Success and Pre-Sales teams, ensuring they could articulate new feature benefits and handle technical questions. These sessions covered everything from API capabilities to security certifications, creating a knowledgeable sales organization that could compete effectively against entrenched competitors.',
        },
        {
          kind: 'steps',
          items: [
            {
              period: 'Q2 2022',
              title: 'Market research & MVP definition',
              detail:
                'Conducted 50+ user interviews, defined product roadmap, and built MVP with core booking and tracking capabilities.',
            },
            {
              period: 'Q3 2022',
              title: 'First 8 client onboardings',
              detail:
                'Launched pilot program, onboarded initial clients, achieved **7× product usage improvement** in the first year.',
            },
            {
              period: 'Q1 2023',
              title: 'VoIP & self-onboarding launch',
              detail:
                'Introduced privacy-preserving communication features, achieved **70% adoption**, expanded to 25+ locations.',
            },
            {
              period: 'Q4 2023',
              title: 'Enterprise scale achieved',
              detail:
                '**15+ clients**, **70,000+ monthly users**, **50+ locations**, **8× ARR** growth milestone reached.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Results & impact',
      blocks: [
        {
          kind: 'p',
          text: 'The true measure of product success lies in measurable business outcomes. RentLz delivered across multiple dimensions — from financial metrics to operational efficiency to user satisfaction.',
        },
        {
          kind: 'metrics',
          items: [
            { value: '8×', label: 'ARR increase' },
            { value: '12×', label: 'Product usage growth' },
            { value: '15+', label: 'Enterprise clients' },
            { value: '20%', label: 'Implementation time reduction' },
            { value: '15%', label: 'Support ticket reduction' },
            { value: '70%', label: 'VoIP feature adoption' },
          ],
        },
        {
          kind: 'p',
          text: '**Revenue growth:** the **8× ARR increase** represented the culmination of strategic pricing decisions, expansion within existing accounts, and new customer acquisition. We moved from a per-trip transactional model to a platform subscription model with usage-based components, creating predictable recurring revenue while aligning our incentives with customer success.',
        },
        {
          kind: 'p',
          text: '**User engagement:** the **12× increase in product usage** validated our hypothesis that a well-designed platform would see organic adoption growth. Users weren\u2019t just completing bookings; they were exploring features, utilizing tracking capabilities, and engaging with the mobile app proactively. The **20% cut in client implementation time** came from standardized APIs and documented playbooks — not from adding more support hours.',
        },
        {
          kind: 'p',
          text: '**Operational efficiency:** the **15% reduction in support tickets** emerged from systematic UX improvements and self-service capabilities. When users could track their own trips, resolve their own booking issues, and access FAQs without contacting support, ticket volume naturally decreased. This freed our customer success team to focus on relationship-building rather than firefighting.',
        },
        {
          kind: 'quote',
          quote: {
            text: "MoveInSync's automation software has minimized manual workload and errors, proving very effective for our daily transportation operations.",
            name: 'Subramani Raman',
            title: 'General Manager, Administration and Facilities',
          },
        },
      ],
    },
    {
      heading: 'Hard parts: challenges & how they were met',
      blocks: [
        {
          kind: 'p',
          text: 'Building an enterprise product at scale inevitably encounters obstacles. The key differentiator lies not in avoiding challenges but in responding to them with strategic solutions.',
        },
        {
          kind: 'lessons',
          items: [
            {
              title: 'Vendor adoption resistance',
              detail:
                'Fleet vendors were accustomed to their own booking systems and viewed our platform as additional administrative burden. We addressed this by designing vendor-facing workflows that reduced their operational overhead: faster payment cycles, automated trip assignments, and simplified documentation. The incentive structure made adoption beneficial rather than mandatory.',
            },
            {
              title: 'Enterprise security concerns',
              detail:
                'Fortune 500 companies had stringent data security requirements that initially seemed to exceed our capabilities. Rather than abandoning these opportunities, I initiated a dedicated compliance program achieving ISO 27001, ISO 27701, and SOC 2 Type 2 certifications. This investment opened doors to enterprise accounts that had previously been inaccessible.',
            },
            {
              title: 'Feature prioritization pressure',
              detail:
                'Every client had feature requests, and sales teams naturally wanted to accommodate them. I implemented a structured prioritization framework weighing customer impact, development effort, and strategic alignment. This framework, combined with transparent communication about roadmap decisions, managed expectations while ensuring we built what mattered most.',
            },
            {
              title: 'Multi-region complexity',
              detail:
                'Expanding to the Philippines and South Africa introduced new requirements around local payment systems, regulatory compliance, and vendor ecosystems. I established regional product managers who understood local market dynamics while maintaining global platform consistency. This distributed approach enabled rapid localization without fragmenting the codebase.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Field lessons & what came next',
      blocks: [
        {
          kind: 'p',
          text: 'Managing RentLz through its growth trajectory taught lessons that extend beyond this specific product. These insights inform my approach to product management generally and will shape future initiatives.',
        },
        {
          kind: 'lessons',
          items: [
            {
              title: 'Enterprise sales cycles require patience but reward persistence',
              detail:
                'Our longest enterprise deal took 18 months from initial contact to signed contract. During this time, we built relationships, addressed concerns iteratively, and demonstrated commitment through pilot programs. The eventual contract value justified the investment.',
            },
            {
              title: 'User research must be continuous, not episodic',
              detail:
                'Early in the product lifecycle, I treated user research as a discrete phase before development. This led to assumptions that aged poorly. Shifting to continuous discovery — ongoing interviews, behavioral analytics, and feedback loops — kept us aligned with evolving user needs.',
            },
            {
              title: 'Platform strategy creates defensible advantages',
              detail:
                'The universal API gateway and the fleet network behind it made the platform harder to copy than any single feature. Future product strategies should prioritize platform capabilities over point solutions.',
            },
            {
              title: 'Metrics should drive action, not just reporting',
              detail:
                'We tracked numerous metrics, but the most impactful were those that directly triggered decisions. The 70% VoIP adoption metric prompted feature expansion into video calling. The 15% support ticket reduction justified additional UX investment.',
            },
          ],
        },
        {
          kind: 'p',
          text: '**Future roadmap:** looking ahead, RentLz is positioned to capitalize on several emerging trends. Electric vehicle integration will address sustainability commitments from enterprise clients. AI-driven predictive analytics will enable proactive trip optimization based on historical patterns. And enhanced safety features leveraging computer vision will further differentiate the offering in a market where employee security remains paramount.',
        },
      ],
    },
  ],
  closing:
    'This dossier reflects my work as Senior Product Manager at MoveInSync, where I led the RentLz corporate car rental vertical from concept to market-leading position. The metrics and achievements documented reflect team efforts across product, engineering, sales, and customer success functions.',
};
