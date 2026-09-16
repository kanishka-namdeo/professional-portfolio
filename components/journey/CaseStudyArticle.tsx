// components/journey/CaseStudyArticle.tsx
// Presentational renderer for a CaseStudyDoc. Shared by the in-page dossier
// overlay (CaseStudyDossier) and the standalone /case-study/[slug] route, so
// both surfaces stay identical. No hooks — safe in server and client trees.

import { Fragment } from 'react';
import type {
  CaseStudyBlock,
  CaseStudyDoc,
  CaseStudyQuote,
} from '@/data/caseStudy';

// Inline **bold** / *italic* markers from the data layer → styled spans.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-semibold text-[var(--color-ink)]">
            {part.slice(2, -2)}
          </strong>
        ) : part.startsWith('*') ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function QuoteCard({ quote }: { quote: CaseStudyQuote }) {
  return (
    <figure className="my-8 max-w-xl rotate-[-0.8deg] border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/70 p-4 shadow-[2px_3px_6px_var(--color-shadow-soft)] transition-transform duration-150 ease-out hover:rotate-0">
      <blockquote className="font-[family-name:var(--font-voice)] text-base leading-snug text-[var(--color-ink)]">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-2 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">
        {quote.name} — <cite className="not-italic">{quote.title}</cite>
      </figcaption>
    </figure>
  );
}

function Block({ block, inner: Inner }: { block: CaseStudyBlock; inner: 'h3' | 'h4' }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="max-w-[68ch] font-[family-name:var(--font-voice)] text-[1.02em] leading-relaxed text-[var(--color-ink)]">
          <Inline text={block.text} />
        </p>
      );
    case 'metrics':
      return (
        <div className="my-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
          {block.items.map((m) => (
            <div
              key={m.label}
              className="border border-[var(--color-inkline)] bg-[var(--color-paper)]/60 px-4 py-3 text-center shadow-[2px_3px_6px_var(--color-shadow-soft)]"
            >
              <div className="font-[family-name:var(--font-voice)] text-2xl font-bold text-[var(--color-ink)]">{m.value}</div>
              <div className="mt-1 font-[family-name:var(--font-data)] text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      );
    case 'features':
      return (
        <div className="my-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          {block.items.map((f) => (
            <div key={f.title} className="border border-[var(--color-inkline)] bg-[var(--color-paper)]/60 p-4">
              <Inner className="font-[family-name:var(--font-data)] text-[12px] uppercase tracking-widest text-[var(--color-rust-text)]">
                {f.title}
              </Inner>
              <p className="mt-2 font-[family-name:var(--font-voice)] text-[0.95em] leading-relaxed text-[var(--color-ink)]">
                <Inline text={f.detail} />
              </p>
            </div>
          ))}
        </div>
      );
    case 'quote':
      return <QuoteCard quote={block.quote} />;
    case 'steps':
      return (
        <ol className="relative my-8 max-w-xl space-y-6 border-l border-dashed border-[var(--color-inkline)] pl-6">
          {block.items.map((s) => (
            <li key={s.title} className="relative">
              <span
                aria-hidden
                className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-paper)] bg-[var(--color-rust)]"
              />
              <p className="font-[family-name:var(--font-data)] text-[10.5px] uppercase tracking-widest text-[var(--color-rust-text)]">
                {s.period}
              </p>
              <Inner className="mt-1 font-[family-name:var(--font-voice)] text-lg font-semibold text-[var(--color-ink)]">{s.title}</Inner>
              <p className="mt-1 font-[family-name:var(--font-voice)] text-[0.95em] leading-relaxed text-[var(--color-ink)]">
                <Inline text={s.detail} />
              </p>
            </li>
          ))}
        </ol>
      );
    case 'lessons':
      return (
        <ol className="my-8 max-w-xl space-y-5">
          {block.items.map((l, i) => (
            <li key={l.title} className="flex gap-4">
              <span
                aria-hidden
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-inkline)] bg-[var(--color-paper)]/70 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-rust-text)]"
              >
                {i + 1}
              </span>
              <div>
                <Inner className="font-[family-name:var(--font-voice)] text-lg font-semibold leading-snug text-[var(--color-ink)]">
                  {l.title}
                </Inner>
                <p className="mt-1 font-[family-name:var(--font-voice)] text-[0.95em] leading-relaxed text-[var(--color-ink)]">
                  <Inline text={l.detail} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
  }
}

// titleAs: the standalone /case-study route renders this as the page's only
// heading level 1; the in-page dossier keeps the default h2 (the trail page
// already has its own h1). Section and inner heading levels follow from
// titleAs so the outline never skips (h1 → h2 → h3 on the route,
// h2 → h3 → h4 in the dossier).
export function CaseStudyArticle({ doc, titleAs: Title = 'h2' }: { doc: CaseStudyDoc; titleAs?: 'h1' | 'h2' }) {
  const Section = Title === 'h1' ? 'h2' : 'h3';
  const inner = Title === 'h1' ? ('h3' as const) : ('h4' as const);
  return (
    <article aria-label={doc.title}>
      <header>
        <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
          {doc.eyebrow.toUpperCase()}
        </p>
        <Title className="mt-2 font-[family-name:var(--font-voice)] text-3xl font-bold leading-tight text-[var(--color-ink)] sm:text-4xl">
          {doc.title}
        </Title>
        <p className="mt-4 max-w-[62ch] font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]/80">
          {doc.subtitle}
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-y border-[var(--color-inkline)] py-4">
          {doc.meta.map((m) => (
            <div key={m.label}>
              <dt className="font-[family-name:var(--font-data)] text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                {m.label}
              </dt>
              <dd className="mt-0.5 font-[family-name:var(--font-data)] text-[13px] text-[var(--color-ink)]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-10 space-y-12">
        {doc.sections.map((section) => (
          <section key={section.heading} aria-labelledby={`cs-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <Section
              id={`cs-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="border-b border-[var(--color-inkline)] pb-2 font-[family-name:var(--font-data)] text-[12px] uppercase tracking-[0.25em] text-[var(--color-ink)]"
            >
              {section.heading}
            </Section>
            <div className="mt-5 space-y-4">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} inner={inner} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-[var(--color-inkline)] pt-5">
        <p className="max-w-[68ch] font-[family-name:var(--font-voice)] text-[0.95em] italic leading-relaxed text-[var(--color-ink-muted)]">
          {doc.closing}
        </p>
      </footer>
    </article>
  );
}
