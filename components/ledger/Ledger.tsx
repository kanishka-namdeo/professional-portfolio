import { ledgerRepos, writing } from '@/data/ledger';

export function Ledger() {
  return (
    <section id="ledger" aria-labelledby="ledger-title" className="border-t border-[var(--color-inkline)] py-24 [content-visibility:auto] [contain-intrinsic-size:auto_1000px]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 id="ledger-title" className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">THE LEDGER — everything else, plainly</h2>
        <ul className="mt-8 divide-y divide-[var(--color-inkline)]">
          {ledgerRepos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 hover:bg-white/50">
                <span className="font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-rust)]">{r.name}</span>
                <span className="font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]/75">{r.oneLiner}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">{r.language} · {r.year}</span>
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-14 font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">FIELD WRITING</h3>
        <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/45">
          Scroll sideways — a dispatch per card. <span aria-hidden>→</span>
        </p>
        {/* Horizontal snap strip: variety against the vertical ledger, and the
            articles read as dispatches rather than another plain list. */}
        <ul
          role="list"
          tabIndex={0}
          aria-label="Field writing — scroll horizontally"
          className="-mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
        >
          {writing.map((w) => (
            <li key={w.url} className="w-80 shrink-0 snap-start">
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-between border border-[var(--color-ink)]/20 bg-white/60 p-5 transition-colors hover:bg-white/90"
              >
                <span className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">
                  {w.date} · {w.readTime}
                </span>
                <span className="mt-3 font-[family-name:var(--font-voice)] text-lg leading-snug text-[var(--color-ink)]">
                  {w.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
