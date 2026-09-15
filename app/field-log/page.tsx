// app/field-log/page.tsx
// The field log — a print-first, one-page digest of the portfolio. Every fact
// (periods, companies, roles, metrics, projects, writing) is pulled from the
// same data modules that drive the main page, so the paper copy can't drift
// from the site. Print styles live in the @media print block of globals.css.
import type { Metadata } from 'next';
import { eras } from '@/data/journey';
import { camps } from '@/data/camps';
import { writing } from '@/data/ledger';

export const metadata: Metadata = {
  title: { absolute: 'Field Log — Kanishka Namdeo' },
  description:
    'One-page field log of Kanishka Namdeo — Product Manager, 9+ years across SaaS, mobility & AI. 8× ARR · 70K+ monthly users · 50+ locations. Career log, base camps and field writing.',
};

const EMAIL = 'kanishkanamdeo@hotmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/kanishkanamdeo';
const SITE = 'https://kanishkanamdeo.com';

// Canonical proof line, derived from the MoveInSync era's own metrics (8× ARR,
// 70K+ monthly users, 50+ locations) so resume and site can't disagree.
const mobility = eras.find((era) => era.id === 'mobility');
const proof = mobility
  ? mobility.metrics
      .slice(0, 3)
      .map((m) => `${m.value}${m.suffix ?? ''} ${m.label}`)
      .join(' · ')
  : '';

// 1–2 line essence of what the era was about: the first two sentences of the
// era's crossing (what I did), which keeps long engagements bounded.
const essence = (text: string) => (text.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')).trim();

const metricLine = (metrics: { value: number; suffix?: string; label: string }[]) =>
  metrics.map((m) => `${m.value}${m.suffix ?? ''} ${m.label}`).join(' · ');

export default function FieldLog() {
  return (
    <div className="field-log mx-auto max-w-[720px] px-6 pb-16 pt-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header>
        <h1 className="font-[family-name:var(--font-voice)] text-[2.1em] font-bold leading-tight text-[var(--color-ink)]">
          Kanishka Namdeo
        </h1>
        <p className="mt-1 font-[family-name:var(--font-data)] text-[0.8em] tracking-[0.08em] text-[var(--color-rust)]">
          Product Manager · 9+ years · Dubai / remote
        </p>
        <p className="mt-2 font-[family-name:var(--font-data)] text-[0.72em] leading-relaxed text-[var(--color-ink-muted)]">
          <a href={`mailto:${EMAIL}`} className="underline-offset-2 hover:text-[var(--color-rust)] hover:underline">
            {EMAIL}
          </a>
          {' · '}
          <a href={SITE} className="underline-offset-2 hover:text-[var(--color-rust)] hover:underline">
            kanishkanamdeo.com
          </a>
          {' · '}
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-[var(--color-rust)] hover:underline">
            linkedin.com/in/kanishkanamdeo
          </a>
        </p>
        <p className="mt-6 max-w-[62ch] font-[family-name:var(--font-voice)] text-[1.02em] leading-relaxed text-[var(--color-ink)]">
          Product manager with 9+ years across SaaS, mobility &amp; AI — from autonomous
          marine systems and multimodal logistics to legal-tech NLP and AI products. Led
          MoveInSync’s enterprise transport platform to {proof}. I manage the product and
          own the code; open to senior product roles in Dubai or remote.
        </p>
      </header>

      {/* ── Career log ─────────────────────────────────────────────────── */}
      <section aria-labelledby="career-log" className="mt-12">
        <h2
          id="career-log"
          className="border-b border-[var(--color-ink)] pb-2 font-[family-name:var(--font-data)] text-[0.72em] tracking-[0.25em] text-[var(--color-ink)]"
        >
          CAREER LOG
        </h2>
        <ol className="mt-4 space-y-6">
          {eras.map((era) => (
            <li key={era.id}>
              <article>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-voice)] text-[1.3em] font-bold leading-tight text-[var(--color-ink)]">
                    {era.company}
                  </h3>
                  <span className="whitespace-nowrap font-[family-name:var(--font-data)] text-[0.72em] text-[var(--color-ink-muted)]">
                    {era.period}
                  </span>
                </div>
                <p className="mt-0.5 font-[family-name:var(--font-data)] text-[0.72em] text-[var(--color-rust)]">
                  {era.role}
                </p>
                <p className="mt-1.5 max-w-[68ch] font-[family-name:var(--font-voice)] text-[0.95em] leading-relaxed text-[var(--color-ink)]">
                  {essence(era.crossing)}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-data)] text-[0.7em] text-[var(--color-ink-muted)]">
                  {metricLine(era.metrics)}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Base camps ─────────────────────────────────────────────────── */}
      <section aria-labelledby="base-camps" className="mt-12">
        <h2
          id="base-camps"
          className="border-b border-[var(--color-ink)] pb-2 font-[family-name:var(--font-data)] text-[0.72em] tracking-[0.25em] text-[var(--color-ink)]"
        >
          BASE CAMPS
        </h2>
        <ol className="mt-4 space-y-5">
          {camps.map((camp) => (
            <li key={camp.id}>
              <article>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-voice)] text-[1.15em] font-bold leading-tight text-[var(--color-ink)]">
                    {camp.title}
                  </h3>
                  <span className="whitespace-nowrap font-[family-name:var(--font-data)] text-[0.7em] text-[var(--color-ink-muted)]">
                    {camp.year}
                  </span>
                </div>
                <p className="mt-1 max-w-[68ch] font-[family-name:var(--font-voice)] text-[0.95em] leading-relaxed text-[var(--color-ink)]">
                  {camp.tagline}
                </p>
                <a
                  href={camp.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-[family-name:var(--font-data)] text-[0.7em] text-[var(--color-rust)] underline-offset-2 hover:underline"
                >
                  {camp.repoUrl.replace('https://', '')}
                </a>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Field writing ──────────────────────────────────────────────── */}
      <section aria-labelledby="field-writing" className="mt-12">
        <h2
          id="field-writing"
          className="border-b border-[var(--color-ink)] pb-2 font-[family-name:var(--font-data)] text-[0.72em] tracking-[0.25em] text-[var(--color-ink)]"
        >
          FIELD WRITING
        </h2>
        <ul className="mt-4 space-y-3">
          {writing.map((entry) => (
            <li key={entry.url} className="leading-snug">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-voice)] text-[1em] text-[var(--color-ink)] underline-offset-2 hover:text-[var(--color-rust)] hover:underline"
              >
                {entry.title}
              </a>
              <span className="font-[family-name:var(--font-data)] text-[0.7em] text-[var(--color-ink-muted)]">
                {' '}
                — {entry.date} · {entry.readTime}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Colophon ───────────────────────────────────────────────────── */}
      <footer className="mt-14 border-t border-[var(--color-inkline)] pt-4">
        <p className="font-[family-name:var(--font-data)] text-[0.68em] leading-relaxed text-[var(--color-ink-muted)]">
          Field log compiled from the same data that drives kanishkanamdeo.com — set in
          Crimson Pro &amp; JetBrains Mono, ink on parchment. Print this page for the
          paper copy.
        </p>
      </footer>
    </div>
  );
}
