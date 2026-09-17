'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import { modalLockCount, useBackgroundInert, useModalLock } from '@/hooks/useModalLock';
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
  const listboxRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Shared with the global opener below (which captures the trigger at
  // interaction time) — a ref, not state, so the opener never re-renders.
  const restoreFocusRef = useRef<Element | null>(null);
  const items = useMemo(() => buildItems(), []);

  // Mirrors `open` for the global key listener, which is registered once.
  // Synced in an effect: refs must not be written during render.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

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
    // Another overlay (the case-study dossier, or the camp lightbox) holds a
    // modal lock — never stack this palette on top of an open dialog: it
    // would trap focus twice and travel() would scroll a page the reader
    // can't see. Div-based dialogs only exist in the DOM while open, but the
    // lightbox is a native <dialog> that is ALWAYS mounted — match it only
    // in its open state.
    const otherModalOpen = () =>
      !!(
        document.querySelector('[data-modal-dialog]:not([data-modal-dialog="palette"]):not(dialog)') ||
        document.querySelector('dialog[open][data-modal-dialog]:not([data-modal-dialog="palette"])')
      );
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
        if (typing || otherModalOpen()) return;
        event.preventDefault();
        // Capture the trigger at interaction time — the background-inert
        // effect (see useBackgroundInert) kicks focus off the element before
        // an open-effect could read it.
        restoreFocusRef.current = document.activeElement;
        setOpen(true);
        return;
      }
      if (event.key === '/' && !typing && !otherModalOpen()) {
        event.preventDefault();
        if (!openRef.current) restoreFocusRef.current = document.activeElement;
        setOpen((prev) => !prev);
      }
    };
    // The rail's ⌘K button and the mobile chip dispatch this event; the same
    // no-stacking rule applies (a lightbox or dossier may have opened since
    // the listener was registered — always re-check, never assume).
    const onOpenEvent = () => {
      if (otherModalOpen()) return;
      restoreFocusRef.current = document.activeElement;
      setOpen(true);
    };
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
  // scrolls only through Lenis, which is clipped while stopped. The shared
  // lock keeps this composable with the case-study dossier if both are open.
  useModalLock(open);

  // Document-level keyboard handling while open. The React onKeyDown on the
  // dialog div only sees events that bubble THROUGH that div — but clicking
  // the dialog's non-focusable chrome (footer hint, list gutters) parks focus
  // on a focusable ancestor OUTSIDE the dialog, and keydowns then target that
  // ancestor: Escape died and Tab roamed the background while the palette
  // stayed open (verified in Chromium). Handling Escape + the Tab trap at
  // document level works no matter where focus sits, and a focusin reclaim
  // pulls stray focus back into the dialog (belt-and-braces for browsers
  // without `inert` support).
  useEffect(() => {
    if (!open) return;
    const onDocKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      // The input is the dialog's only focusable element, so confining Tab
      // to it is the whole focus trap.
      event.preventDefault();
      inputRef.current?.focus();
    };
    const onFocusIn = (event: FocusEvent) => {
      // Focus changes that stay inside the dialog are fine…
      if (event.target instanceof Node && dialogRef.current?.contains(event.target)) return;
      // …anything else (background click, programmatic focus) gets reclaimed
      // into the dialog's only focusable element.
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', onDocKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onDocKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  // Everything behind the portal-rendered dialog leaves the tab order and
  // the accessibility tree while it is open (WAI-ARIA modal dialog pattern).
  useBackgroundInert(open);

  useEffect(() => {
    if (open) {
      // The trigger was already captured by the opener (interaction time);
      // here the dialog just resets and takes focus after paint.
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (restoreFocusRef.current instanceof HTMLElement) {
      // Runs in the create phase — after every cleanup (incl. the background
      // inert release), so the trigger is focusable again by now.
      restoreFocusRef.current.focus();
      restoreFocusRef.current = null;
    }
  }, [open]);

  // Keep the active option in view while arrowing through long/filtered lists.
  // (Guarded: jsdom and some SSR environments don't implement scrollIntoView.)
  useEffect(() => {
    if (!open) return;
    const activeOption = listboxRef.current?.querySelector('[aria-selected="true"]');
    if (activeOption && typeof activeOption.scrollIntoView === 'function') {
      activeOption.scrollIntoView({ block: 'nearest' });
    }
  }, [open, active, results]);

  if (!open) return null;

  const travel = (item: PaletteItem, opts?: { immediate?: boolean }) => {
    setOpen(false);
    // travel() runs before the open-effect cleanup has restarted Lenis, and
    // a stopped Lenis ignores scrollTo — so resume it explicitly first. Only
    // when this palette holds the page's last modal lock, though: over a
    // stacked overlay (dossier), releasing the lock here would scroll the
    // page behind a modal the reader is still inside.
    if (modalLockCount() <= 1) lenis?.start();
    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!item.scrollTo) return;
    if (lenis) {
      // Keyboard travel is instant (house rule, same as the rail); mouse is
      // smooth. Lenis itself forces immediate under reduced motion. The -80
      // offset matches the anchor-click offset configured in layout.tsx so
      // button-driven jumps keep the same breathing room below the header.
      const offset = { offset: -80 };
      lenis.scrollTo(item.scrollTo, opts?.immediate ? { immediate: true, ...offset } : offset);
    } else {
      document.querySelector(item.scrollTo)?.scrollIntoView({ behavior: opts?.immediate ? 'auto' : 'smooth' });
    }
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

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Jump to a waypoint"
      data-modal-dialog="palette"
      // Desktop keeps the centred drop panel (items-start + 12vh); below md it
      // docks to the bottom edge as a full-width sheet (thumb reach, and the
      // panel never covers the MobileTrailChip the tap came from).
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[var(--color-ink)]/25 md:items-start md:px-4 md:pt-[12vh]"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="max-h-[80dvh] w-full max-w-lg select-none overflow-y-auto rounded-t-lg border border-[var(--color-ink)] bg-[var(--color-parchment)] shadow-[6px_6px_0_var(--color-shadow-hard)] md:max-h-none md:overflow-visible md:rounded-none">
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
            role="combobox"
            // The listbox is rendered for the dialog's whole lifetime (the
            // empty state included), so the popup is always expanded while
            // this input exists — announcing "collapsed" with zero results
            // lied to assistive tech (WCAG 4.1.2).
            aria-expanded={true}
            aria-autocomplete="list"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            className="w-full select-text bg-transparent font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-muted)] focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
          />
        </div>
        {/* data-lenis-prevent: while this dialog is open Lenis is STOPPED, and a
            stopped Lenis preventDefaults every wheel event unless it starts
            inside a data-lenis-prevent element — without this the listbox
            could not be wheel-scrolled at all. */}
        <ul
          id="palette-list"
          role="listbox"
          aria-label="Destinations"
          data-lenis-prevent
          className="max-h-[50vh] overflow-y-auto py-2"
          ref={listboxRef}
        >
          {results.length === 0 && (
            // role="presentation": a listbox's children must be options — the
            // empty-state row must not read as a phantom option.
            <li role="presentation" className="px-4 py-3 font-[family-name:var(--font-data)] text-xs text-[var(--color-ink-muted)]">
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
                index === active ? 'bg-[var(--color-rust)] text-[var(--color-on-rust)]' : 'text-[var(--color-ink)]'
              }`}
            >
              <span className="block font-[family-name:var(--font-voice)] text-base leading-snug">{item.label}</span>
              <span
                className={`block font-[family-name:var(--font-data)] text-[11px] ${
                  index === active ? 'text-[var(--color-on-rust)]' : 'text-[var(--color-ink-muted)]'
                }`}
              >
                {item.sub}
              </span>
            </li>
          ))}
        </ul>
        <p className="select-none border-t border-[var(--color-inkline)] px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink-muted)] md:pb-2">
          ↑↓ move · ↵ travel · esc / ⌘K close — also on the trail rail: ↑↓ jumps between waypoints
        </p>
      </div>
    </div>,
    document.body,
  );
}
