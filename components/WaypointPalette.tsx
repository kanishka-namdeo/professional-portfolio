'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';
import { camps } from '@/data/camps';
import { writing } from '@/data/ledger';

interface PaletteItem {
  id: string;
  label: string;
  sub: string;
  href?: string;
  scrollTo?: string;
  kind: 'waypoint' | 'camp' | 'section' | 'writing';
}

/** Event name the rail (or anything else) can dispatch to open the palette. */
export const OPEN_PALETTE_EVENT = 'open-waypoint-palette';

function buildItems(): PaletteItem[] {
  return [
    ...eras.map((era) => ({
      id: `era-${era.id}`,
      label: `${era.number} · ${era.company}`,
      sub: `${era.role} — ${era.period}`,
      scrollTo: `#era-${era.id}`,
      kind: 'waypoint' as const,
    })),
    ...camps.map((camp) => ({
      id: `camp-${camp.id}`,
      label: `Base camp · ${camp.title}`,
      sub: camp.tagline,
      scrollTo: `#camp-${camp.id}`,
      kind: 'camp' as const,
    })),
    { id: 'ledger', label: 'The Ledger', sub: 'Everything else, plainly', scrollTo: '#ledger', kind: 'section' },
    { id: 'contact', label: 'End of the Trail', sub: 'Write in', scrollTo: '#contact', kind: 'section' },
    ...writing.map((w) => ({
      id: w.url,
      label: w.title,
      sub: `${w.date} · ${w.readTime} — opens Medium`,
      href: w.url,
      kind: 'writing' as const,
    })),
  ];
}

/**
 * Waypoint jumper: ⌘K / Ctrl+K (or "/") opens a filterable list of every
 * destination on the page. Arrow keys move, Enter travels, Esc closes.
 * A mouse user can open it from the progress rail.
 */
export function WaypointPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<Element | null>(null);
  const items = useMemo(buildItems, []);

  // Mirrors `open` for the global key listener, which is registered once.
  const openRef = useRef(open);
  openRef.current = open;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(q));
  }, [items, query]);

  // Global opener. Ignore "/" while typing in a field; Cmd/Ctrl+K is allowed
  // from the palette's own input (it closes) and from anywhere else except
  // foreign text fields (where it would corrupt the user's text).
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };
    const inPaletteInput = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest?.('[data-palette-input]');
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const typing = isTypingTarget(target);
      const cmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (cmdK) {
        if (typing && inPaletteInput(target)) {
          event.preventDefault();
          if (openRef.current) setOpen(false);
          return;
        }
        if (typing) return;
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === '/' && !typing) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, []);

  // While the dialog is open, stop the Lenis engine so wheel input can't
  // scroll the page behind the modal (and the result list scrolls natively).
  // Native key/wheel scrolling of the document is already inert: the page
  // scrolls only through Lenis, which is clipped while stopped.
  useEffect(() => {
    if (!open || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement;
      setQuery('');
      setActive(0);
      // Focus after paint so the dialog is in the DOM.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (restoreFocus.current instanceof HTMLElement) {
      restoreFocus.current.focus();
      restoreFocus.current = null;
    }
  }, [open]);

  if (!open) return null;

  const travel = (item: PaletteItem, opts?: { immediate?: boolean }) => {
    setOpen(false);
    // travel() runs before the open-effect cleanup has restarted Lenis, and
    // a stopped Lenis ignores scrollTo — so resume it explicitly first.
    lenis?.start();
    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!item.scrollTo) return;
    if (lenis) {
      // Keyboard travel is instant (house rule, same as the rail); mouse is
      // smooth. Lenis itself forces immediate under reduced motion.
      lenis.scrollTo(item.scrollTo, opts?.immediate ? { immediate: true } : undefined);
    } else {
      document.querySelector(item.scrollTo)?.scrollIntoView({ behavior: opts?.immediate ? 'auto' : 'smooth' });
    }
  };

  // The input is the dialog's only focusable element, so confining Tab to it
  // is the whole focus trap.
  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    inputRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActive((i) => Math.min(results.length - 1, i + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case 'Enter': {
        event.preventDefault();
        const item = results[active];
        if (item) travel(item, { immediate: true });
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Jump to a waypoint"
      onKeyDown={trapFocus}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-[var(--color-ink)]/25 px-4 pt-[12vh]"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-lg border border-[var(--color-ink)] bg-[var(--color-parchment)] shadow-[6px_6px_0_var(--color-shadow-hard)]">
        <div className="flex items-center gap-3 border-b border-[var(--color-inkline)] px-4 py-3">
          <span aria-hidden className="font-[family-name:var(--font-data)] text-xs text-[var(--color-rust)]">⌘K</span>
          <input
            ref={inputRef}
            data-palette-input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a waypoint, camp, or dispatch…"
            aria-label="Search destinations"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            className="w-full bg-transparent font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]/40"
          />
        </div>
        <ul id="palette-list" role="listbox" aria-label="Destinations" className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-3 font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/50">
              No destination matches “{query}”.
            </li>
          )}
          {results.map((item, index) => (
            <li
              key={item.id}
              id={`palette-${item.id}`}
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => travel(item)}
              className={`mx-2 cursor-pointer px-3 py-2 ${
                index === active ? 'bg-[var(--color-rust)] text-[var(--color-parchment)]' : 'text-[var(--color-ink)]'
              }`}
            >
              <span className="block font-[family-name:var(--font-voice)] text-base leading-snug">{item.label}</span>
              <span
                className={`block font-[family-name:var(--font-data)] text-[11px] ${
                  index === active ? 'text-[var(--color-parchment)]/80' : 'text-[var(--color-ink)]/55'
                }`}
              >
                {item.sub}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-[var(--color-inkline)] px-4 py-2 font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink)]/45">
          ↑↓ move · ↵ travel · esc / ⌘K close — also on the trail rail: ↑↓ jumps between waypoints
        </p>
      </div>
    </div>
  );
}
