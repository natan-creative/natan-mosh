"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { A11Y_KEY, a11yClasses, a11yDefaults, type A11yState } from "@/lib/a11y";

const toggles: { key: Exclude<keyof A11yState, "zoom">; label: string }[] = [
  { key: "contrast", label: "ניגודיות גבוהה" },
  { key: "mono", label: "גווני אפור" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "font", label: "גופן קריא" },
  { key: "still", label: "עצירת אנימציות" },
  { key: "cursor", label: "סמן עכבר גדול" },
];

function load(): A11yState {
  try {
    return { ...a11yDefaults, ...JSON.parse(localStorage.getItem(A11Y_KEY) ?? "{}") };
  } catch {
    return a11yDefaults;
  }
}

export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(a11yDefaults);
  const [ready, setReady] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- קריאה חד-פעמית מ-localStorage אחרי hydration
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    html.classList.forEach((c) => c.startsWith("a11y-") && html.classList.remove(c));
    html.classList.add(...a11yClasses(state));
    try {
      localStorage.setItem(A11Y_KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button:not(:disabled)")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const set = (patch: Partial<A11yState>) => setState((s) => ({ ...s, ...patch }));

  return (
    <>
      <button
        ref={button}
        type="button"
        className="fab fab-a11y"
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="4.2" r="2" />
          <path d="M4.5 7.6c2.4.7 4.9 1 7.5 1s5.1-.3 7.5-1l.5 1.8c-1.9.6-3.9.9-5.9 1.1v3.3l2.2 7.2-1.8.6L12.3 15h-.6l-2.2 6.6-1.8-.6 2.2-7.2v-3.3c-2-.2-4-.5-5.9-1.1l.5-1.8Z" />
        </svg>
      </button>

      <div id="a11y-panel" ref={panel} className="a11y-panel" role="dialog" aria-label="הגדרות נגישות" hidden={!open}>
        <p className="a11y-title">נגישות</p>

        <div className="a11y-zoom" role="group" aria-label="גודל טקסט">
          <span>גודל טקסט</span>
          <div>
            <button type="button" onClick={() => set({ zoom: Math.max(0, state.zoom - 1) as A11yState["zoom"] })} disabled={state.zoom === 0} aria-label="הקטנת טקסט">
              א-
            </button>
            <output aria-live="polite">{100 + state.zoom * 15}%</output>
            <button type="button" onClick={() => set({ zoom: Math.min(3, state.zoom + 1) as A11yState["zoom"] })} disabled={state.zoom === 3} aria-label="הגדלת טקסט">
              א+
            </button>
          </div>
        </div>

        <ul className="a11y-list">
          {toggles.map((t) => (
            <li key={t.key}>
              <button type="button" aria-pressed={state[t.key]} onClick={() => set({ [t.key]: !state[t.key] })}>
                <span className="a11y-check" aria-hidden="true" />
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="a11y-foot">
          <button type="button" onClick={() => setState(a11yDefaults)}>
            איפוס הגדרות
          </button>
          <Link href="/accessibility" onClick={() => setOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      </div>
    </>
  );
}
