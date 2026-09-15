// data/faq.ts
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Are you open to remote opportunities?',
    answer:
      "Yes. I've been working with distributed teams for years, so I'm fluent in Slack, Zoom, and the occasional 3 AM emergency call. I've learned that great product work doesn't require being in the same room.",
  },
  {
    question: "What's your biggest product failure, and what did you learn?",
    answer:
      'Early in my career, I spent 3 months building advanced analytics dashboards I was personally excited about. Launch day: 2 users enabled it. Zero ongoing usage. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build: 20+ interviews minimum.',
  },
  {
    question: 'How do you handle stakeholders who disagree with your priorities?',
    answer:
      "Disagreement is healthy. It's often where the best decisions emerge. I listen first, bring data second, and explicitly call out trade-offs. If we're fundamentally misaligned, I escalate rather than debate for weeks. I've had stakeholders resist features that later became our biggest wins. They became advocates because I listened.",
  },
  {
    question: 'Why should someone hire you?',
    answer:
      "Honestly? I ask a lot of questions. More than some people enjoy. But I've found that the right questions lead to better products and fewer 3 AM emergency calls. I bridge engineering and customers because I've been on both sides.",
  },
];
