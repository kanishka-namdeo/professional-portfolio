import ContactFAQ from '@/components/ContactFAQ';
import { FieldNote } from '@/components/FieldNote';

export function EndOfTrail() {
  return (
    <section id="contact" aria-labelledby="eot-title" className="border-t border-[var(--color-inkline)] bg-[var(--color-parchment)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">END OF THE TRAIL</p>
        <h2 id="eot-title" className="mt-2 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
          The next waypoint could be yours.
        </h2>
        <p className="mt-6 max-w-2xl font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]/85">
          I’m Kanishka — a technical product manager in Dubai. I’ve shipped autonomous boats, logistics platforms,
          patent-search NLP, and agent pipelines. I manage the product and own the code: 9+ years,
          8× ARR, and still committing to main. Open to new roles — Dubai or remote.
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          <a href="mailto:kanishkanamdeo@hotmail.com" className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[3px_3px_0_var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">Email me</a>
          <a href="https://www.linkedin.com/in/kanishkanamdeo/" target="_blank" rel="noopener noreferrer" className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">LinkedIn</a>
          <a href="https://github.com/kanishka-namdeo" target="_blank" rel="noopener noreferrer" className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">GitHub</a>
          <a href="https://medium.com/@kanishkanamdeo" target="_blank" rel="noopener noreferrer" className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">Medium</a>
        </div>
        <FieldNote />
        <div className="mt-14">
          <ContactFAQ />
        </div>
        <p className="mt-16 border-t border-[var(--color-inkline)] pt-6 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">
          Set in Crimson Pro & JetBrains Mono. Contours drawn with simplex noise, committed as SVG. Built by hand in Next.js. No stock photos; every image is the work.
        </p>
      </div>
    </section>
  );
}
