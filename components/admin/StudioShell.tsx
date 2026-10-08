"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/app/admin/actions";
import { AREA_LABELS } from "@/lib/content/diff";
import type { PreviewMessage } from "./PreviewApp";
import { type Device, useStudio } from "./StudioContext";
import { Button, useConfirm } from "./ui";

const NAV: { group: string; items: { href: string; label: string }[] }[] = [
  { group: "", items: [{ href: "/admin", label: "סקירה" }] },
  {
    group: "תוכן",
    items: [
      { href: "/admin/hero", label: "פתיחה" },
      { href: "/admin/work", label: "עבודות נבחרות" },
      { href: "/admin/digital", label: "דיגיטל ורעיונות" },
      { href: "/admin/naming", label: "שמות" },
      { href: "/admin/about", label: "אודות" },
      { href: "/admin/contact", label: "יצירת קשר" },
      { href: "/admin/header", label: "תפריט עליון" },
      { href: "/admin/footer", label: "תחתית העמוד" },
    ],
  },
  {
    group: "עיצוב",
    items: [
      { href: "/admin/style", label: "סגנון וצבעים" },
      { href: "/admin/typography", label: "טיפוגרפיה" },
      { href: "/admin/buttons", label: "כפתורים" },
      { href: "/admin/elements", label: "מיקום והסתרה" },
      { href: "/admin/layout", label: "סדר ופריסה" },
      { href: "/admin/motion", label: "תנועה" },
    ],
  },
  { group: "מדיה", items: [{ href: "/admin/media", label: "ספריית מדיה" }] },
  {
    group: "אתר",
    items: [
      { href: "/admin/seo", label: "גוגל ושיתוף" },
      { href: "/admin/settings", label: "הגדרות" },
      { href: "/admin/history", label: "היסטוריית גרסאות" },
    ],
  },
];

const DEVICES: { id: Device; label: string; icon: string; width: number }[] = [
  { id: "desktop", label: "מחשב", icon: "🖥", width: 1440 },
  { id: "tablet", label: "טאבלט", icon: "▣", width: 834 },
  { id: "mobile", label: "טלפון", icon: "▯", width: 390 },
];

function SaveStatus() {
  const { saveState, retrySave } = useStudio();
  if (saveState === "error")
    return (
      <span className="ad-status is-error" role="status">
        השמירה נכשלה ·{" "}
        <button type="button" onClick={retrySave}>
          לנסות שוב
        </button>
      </span>
    );
  return (
    <span className="ad-status" role="status" aria-live="polite">
      טיוטה · {saveState === "saved" ? "נשמר ✓" : "שומר…"}
    </span>
  );
}

export function usePublishFlow() {
  const { changes, publish } = useStudio();
  const confirm = useConfirm();
  return async () => {
    const ok = await confirm({
      title: "האם לפרסם את השינויים?",
      body: changes.length ? (
        <>
          <p>השינויים יופיעו באתר החי מיד:</p>
          <ul>
            {changes.map((k) => (
              <li key={k}>{AREA_LABELS[k]}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>אין שינויים חדשים, אבל אפשר לפרסם שוב.</p>
      ),
      confirm: "פרסום",
    });
    if (ok) await publish();
  };
}

export const openPreview = (path = "/") => window.open(`/preview?path=${encodeURIComponent(path)}`, "_blank", "noopener");

function PreviewPane() {
  const { content, previewPath, device, update, selectedEl, setSelectedEl } = useStudio();
  const editing = usePathname() === "/admin/elements";
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(800);
  const [initialPath] = useState(previewPath);
  const width = DEVICES.find((d) => d.id === device)!.width;

  const post = (m: PreviewMessage) => frame.current?.contentWindow?.postMessage(m, location.origin);

  useEffect(() => {
    const onMsg = (e: MessageEvent<PreviewMessage>) => {
      if (e.origin !== location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "nk:ready") {
        ready.current = true;
        post({ type: "nk:content", content });
        post({ type: "nk:navigate", path: previewPath });
        post({ type: "nk:edit", enabled: editing, selected: selectedEl });
      }
      if (e.data?.type === "nk:move") {
        const { id, x, y } = e.data;
        update((d) => {
          const k = id as keyof typeof d.elements;
          d.elements[k] = { ...d.elements[k], x, y };
        }, `el.${id}`);
      }
      if (e.data?.type === "nk:select") setSelectedEl(e.data.id);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  });

  // כל שינוי מגיע ל-Preview מיד (פעם אחת לפריים)
  useEffect(() => {
    if (!ready.current) return;
    const raf = requestAnimationFrame(() => post({ type: "nk:content", content }));
    return () => cancelAnimationFrame(raf);
  }, [content]);

  useEffect(() => {
    if (ready.current) post({ type: "nk:navigate", path: previewPath });
  }, [previewPath]);

  useEffect(() => {
    if (ready.current) post({ type: "nk:edit", enabled: editing, selected: selectedEl });
  }, [editing, selectedEl]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const s = Math.min(1, (e.contentRect.width - 2) / width);
      setScale(s);
      setHeight(e.contentRect.height / s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div className="ad-preview" ref={box}>
      <div className="ad-preview-frame" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={frame}
          title="תצוגה מקדימה חיה של האתר"
          src={`/preview?embed=1&path=${encodeURIComponent(initialPath)}`}
          style={{ width, height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

export function StudioShell({ children, email, authDisabled }: { children: React.ReactNode; email: string; authDisabled?: boolean }) {
  const s = useStudio();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  // מעבר עמוד סוגר את התפריט במובייל
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMenu(false);
  }
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const publishFlow = usePublishFlow();
  const fullWidth = pathname === "/admin/media" || pathname === "/admin/history";

  return (
    <div className="ad-shell" data-menu={menu || undefined} data-view={mobileView} data-full={fullWidth || undefined}>
      <header className="ad-top">
        <div className="ad-top-start">
          <button type="button" className="ad-menu-btn" aria-expanded={menu} aria-controls="ad-sidebar" onClick={() => setMenu((m) => !m)}>
            ☰ תפריט
          </button>
          <Link href="/admin" className="ad-logo">
            הסטודיו
          </Link>
          <SaveStatus />
          {authDisabled && (
            <span className="ad-status is-test" title="נשמר בקבצים מקומיים, לא ב-Supabase. כבוי אוטומטית ב-Vercel.">
              מצב בדיקה · בלי סיסמה
            </span>
          )}
        </div>
        <div className="ad-top-end">
          <div className="ad-group" role="group" aria-label="ביטול וחזרה">
            <Button variant="ghost" onClick={s.undo} disabled={!s.canUndo} title="Ctrl/⌘ + Z">
              ↶ ביטול
            </Button>
            <Button variant="ghost" onClick={s.redo} disabled={!s.canRedo} title="Ctrl/⌘ + Shift + Z">
              ↷ חזרה
            </Button>
          </div>
          {!fullWidth && (
            <div className="ad-group ad-devices" role="radiogroup" aria-label="גודל תצוגה מקדימה">
              {DEVICES.map((d) => (
                <button key={d.id} type="button" role="radio" aria-checked={s.device === d.id} className="ad-device" onClick={() => s.setDevice(d.id)}>
                  <span aria-hidden="true">{d.icon}</span> {d.label}
                </button>
              ))}
            </div>
          )}
          <Button onClick={() => openPreview(s.previewPath)}>תצוגה מקדימה</Button>
          <Button variant="primary" onClick={publishFlow}>
            פרסום
          </Button>
        </div>
      </header>

      <nav id="ad-sidebar" className="ad-sidebar" aria-label="עריכת האתר">
        {NAV.map((g) => (
          <div key={g.group || "home"} className="ad-nav-group">
            {g.group && <p className="ad-nav-title">{g.group}</p>}
            {g.items.map((it) => {
              const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
              return (
                <Link key={it.href} href={it.href} className="ad-nav-link" aria-current={active ? "page" : undefined}>
                  {it.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="ad-nav-foot">
          <a href="/" target="_blank" rel="noreferrer" className="ad-nav-link">
            לאתר החי ↗
          </a>
          {!authDisabled && (
            <form action={logout}>
              <button type="submit" className="ad-nav-link">
                יציאה {s.backend === "local" ? "(מצב פיתוח)" : ""}
              </button>
            </form>
          )}
          <p className="ad-hint" dir="ltr">
            {email}
          </p>
        </div>
      </nav>

      {!fullWidth && (
        <div className="ad-mobile-switch" role="radiogroup" aria-label="מה להציג">
          <button type="button" role="radio" aria-checked={mobileView === "edit"} onClick={() => setMobileView("edit")}>
            עריכה
          </button>
          <button type="button" role="radio" aria-checked={mobileView === "preview"} onClick={() => setMobileView("preview")}>
            תצוגה
          </button>
        </div>
      )}

      <main className="ad-main" id="ad-main">
        <div className="ad-editor">{children}</div>
        {!fullWidth && <PreviewPane />}
      </main>

      {s.changes.length > 0 && (
        <div className="ad-savebar" role="region" aria-label="שינויים שלא פורסמו">
          <p>
            יש לך שינויים שלא פורסמו <span className="ad-hint">({s.changes.map((k) => AREA_LABELS[k]).join(", ")})</span>
          </p>
          <div>
            <Button onClick={() => openPreview(s.previewPath)}>תצוגה מקדימה</Button>
            <Button onClick={s.saveCheckpoint}>שמירת טיוטה</Button>
            <Button variant="primary" onClick={publishFlow}>
              פרסום
            </Button>
          </div>
        </div>
      )}

      <div className="ad-toast" role="status" aria-live="polite">
        {s.toast}
      </div>
    </div>
  );
}
