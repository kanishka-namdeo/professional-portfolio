import { ledgerRepos, writing } from '@/data/ledger';

export function Ledger() {
  return (
    <section id="ledger" aria-labelledby="ledger-title" className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 id="ledger-title" className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">THE LEDGER — everything else, plainly</h2>
        <ul className="mt-8 divide-y divide-[var(--color-inkline)]">
          {ledgerRepos.map((r) => (
            <li key={r.name}>
              <a href={r.url} aria-label={r.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 hover:bg-white/50">
                <span className="font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-rust)]">{r.name}</span>
                <span className="font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]/75">{r.oneLiner}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">{r.language} · {r.year}</span>
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-14 font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">FIELD WRITING</h3>
        <ul className="mt-4 divide-y divide-[var(--color-inkline)]">
          {writing.map((w) => (
            <li key={w.url}>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 hover:bg-white/50">
                <span className="font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]">{w.title}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">{w.date} · {w.readTime}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
