/**
 * Product-Media Mapping Data Structure
 * Maps each product to its relevant media coverage for the compact media row
 */

export interface MediaItem {
  source: string;
  title: string;
  url: string;
  icon: string;
}

export interface Product {
  title: string;
  role: string;
  description: string;
  image: string;
  altText: string;
  category: string;
  tags: string[];
  url: string;
  hasCaseStudy: boolean;
  caseStudyId: string | null;
  media?: MediaItem[]; // Optional media coverage
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const withBasePath = (path: string) => `${basePath}${path}`;

export const products: Product[] = [
  {
    title: 'MoveInSync Business Travel Solution',
    role: 'Led',
    description: 'Corporate car rental SaaS platform driving 8x ARR increase and 12x product usage growth with 30K+ users across 50+ locations.',
    image: withBasePath('/imgs/corporate-car-rental-fleet-variety.jpg'),
    altText: 'Diverse fleet of corporate rental cars representing the MoveInSync business travel solution',
    category: 'SaaS, Mobility',
    tags: ['8x ARR Increase', '30K+ Users', '50+ Locations'],
    url: 'https://moveinsync.com/corporate-car-rental-solution/',
    hasCaseStudy: true,
    caseStudyId: 'rentlz',
    media: [
      {
        source: 'Impakter',
        title: 'Indian Startup MoveInSync Pioneers Intelligent Commutes Across the Globe',
        url: 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/',
        icon: '📰',
      },
      {
        source: 'Economic Times',
        title: 'MoveInSync to Expand Operations to Philippines, Ghana',
        url: 'https://economictimes.indiatimes.com/tech/startups/saas-platform-moveinsync-to-expand-operations-to-philippines-ghana-eyes-doubling-of-revenue/articleshow/95732271.cms?from=mdr',
        icon: '📰',
      },
    ],
  },
  {
    title: 'Spectre Modular Drone / UAV Control Software',
    role: 'Built',
    description: 'UAV control software and drone swarm algorithm achieving 15% cost savings. India\'s first modular drone with 50-minute endurance.',
    image: withBasePath('/imgs/autonomous-drone-ces-innovation-award-2021.jpg'),
    altText: 'Spectre modular drone at CES 2021 showcasing India\'s first modular UAV',
    category: 'Robotics, Defense',
    tags: ['15% Cost Savings', '50-min Endurance', 'India\'s First Modular Drone'],
    url: 'https://www.sagardefence.com/uav/',
    hasCaseStudy: false,
    caseStudyId: null,
    media: undefined, // No direct media coverage for this product
  },
  {
    title: 'Natural Language Processing MVP',
    role: 'Led',
    description: 'NLP solution using LLMs for patent analysis, increasing productivity by 10x.',
    image: withBasePath('/imgs/ai-ml-nlp-deep-learning-relationship-venn-diagram.jpg'),
    altText: 'Venn diagram illustrating AI, machine learning, and natural language processing relationships',
    category: 'AI/ML, NLP',
    tags: ['10x Productivity', 'LLM Integration', 'Patent Analysis'],
    url: 'https://tekip.com/it/',
    hasCaseStudy: false,
    caseStudyId: null,
    media: undefined, // No direct media coverage for this product
  },
  {
    title: 'In-plant Tracking System',
    role: 'Shaped',
    description: 'IoT-based tracking system for efficient vehicle movement in warehouses using smart sensing technology.',
    image: withBasePath('/imgs/isometric-warehouse-logistics-wms-infographic.jpg'),
    altText: 'Isometric warehouse layout demonstrating IoT-based vehicle tracking',
    category: 'IoT, Logistics',
    tags: ['IoT-based', 'Smart Sensing', 'Enterprise'],
    url: 'https://www.intugine.com/solutions/inplant-tracking',
    hasCaseStudy: false,
    caseStudyId: null,
    media: undefined, // No direct media coverage for this product
  },
  {
    title: 'Trashfin / Wasteshark Water Cleaning Drone',
    role: 'Built',
    description: 'Autonomous water surface cleaning drone capable of collecting 350kg garbage in 8 hours.',
    image: withBasePath('/imgs/ocean_cleanup_barrier_system_plastic_removal.jpg'),
    altText: 'Ocean cleanup barrier system removing plastic waste from water surface',
    category: 'Robotics, Environmental',
    tags: ['350kg Capacity', '8 Hours Operation', 'Autonomous'],
    url: '',
    hasCaseStudy: false,
    caseStudyId: null,
    // Direct media coverage for this product
    media: [
      {
        source: 'BBC',
        title: 'Waste Collection Drones',
        url: 'https://fb.watch/u1MvvTNV-Q/',
        icon: '📰',
      },
      {
        source: 'Mumbai Mirror',
        title: 'Welcome Trashfin',
        url: 'https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.cms',
        icon: '📰',
      },
      {
        source: 'Future Entech',
        title: 'Wasteshark Drone',
        url: 'https://futureentech.com/indian-startup-wastershark-water-surface-cleaning-drone/',
        icon: '📰',
      },
    ],
  },
  {
    title: 'Wildlife Surveillance & Anti-Poaching System',
    role: 'Built',
    description: 'Government-installed surveillance system for wildlife protection in Rajasthan\'s tiger reserves including Ranthambore and Sariska.',
    image: withBasePath('/imgs/wildlife-surveillance.png'),
    altText: 'Wildlife surveillance dashboard for anti-poaching monitoring in Rajasthan tiger reserves',
    category: 'Government, Conservation',
    tags: ['Rajasthan Gov', 'Tiger Reserves', 'Surveillance'],
    url: '',
    hasCaseStudy: false,
    caseStudyId: null,
    // Direct media coverage for this product
    media: [
      {
        source: 'BBC Referenced',
        title: 'Rajasthan Wildlife System',
        url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/',
        icon: '📰',
      },
      {
        source: 'The Hindu',
        title: 'Maharashtra Startups',
        url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece',
        icon: '📰',
      },
    ],
  },
];

// Helper function to get CSS class for media source
export function getMediaSourceClass(source: string): string {
  const normalized = source.toLowerCase().replace(/\s+/g, '-');
  return `media-source-${normalized}`;
}
