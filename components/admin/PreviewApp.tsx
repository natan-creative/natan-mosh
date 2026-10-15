"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { SiteChrome } from "@/components/site/SiteChrome";
import { AccessibilityView, HomeView, LegalView, NotFoundView, ProjectView, WorkIndexView } from "@/components/site/views";

// ה-Preview מציג את האתר האמיתי עם הטיוטה. בתוך ה-Admin (embed) הוא מקבל עדכונים חיים ב-postMessage.
export type PreviewMessage =
  | { type: "nk:content"; content: SiteContent }
  | { type: "nk:navigate"; path: string }
  | { type: "nk:ready" }
  | { type: "nk:path"; path: string }
  // מצב עריכת מיקום: ה-Admin מדליק, ה-Preview מדווח על גרירה ובחירה
  | { type: "nk:edit"; enabled: boolean; selected: string | null }
  | { type: "nk:move"; id: string; x: number; y: number }
  | { type: "nk:select"; id: string };

const OFFSET_X = 480;
const OFFSET_Y = 360;

export function PreviewApp({ initial, embed, initialPath, revision }: { initial: SiteContent; embed: boolean; initialPath: string; revision: string | null }) {
  const [c, setC] = useState(initial);
  const [path, setPath] = useState(initialPath);
  const [version, setVersion] = useState(0);
  const [edit, setEdit] = useState<{ enabled: boolean; selected: string | null }>({ enabled: false, selected: null });
  const [pathname, hash] = path.split("#");

  useEffect(() => {
    const go = (p: string) => {
      setPath(p);
      if (embed) parent.postMessage({ type: "nk:path", path: p } satisfies PreviewMessage, location.origin);
    };
    const onMessage = (e: MessageEvent<PreviewMessage>) => {
      if (e.origin !== location.origin) return;
      if (e.data?.type === "nk:content") {
        setC(e.data.content);
        setVersion((v) => v + 1);
      }
      if (e.data?.type === "nk:navigate") setPath(e.data.path);
      if (e.data?.type === "nk:edit") setEdit({ enabled: e.data.enabled, selected: e.data.selected });
    };
    // קישורים פנימיים לא עוזבים את ה-Preview: מחליפים את העמוד המוצג
    const onClick = (e: MouseEvent) => {
      // במצב עריכה לחיצות לא מנווטות ולא מפעילות כפתורים
      if (document.documentElement.classList.contains("nk-edit")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith("/admin")) return;
      e.preventDefault();
      e.stopPropagation();
      go(url.pathname + url.hash);
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    if (embed) parent.postMessage({ type: "nk:ready" } satisfies PreviewMessage, location.origin);
    else document.documentElement.classList.add("has-preview-banner");
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, [embed]);

  // מצב עריכה: גרירת אלמנטים
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("nk-edit", edit.enabled);
    document.querySelectorAll("[data-selected]").forEach((n) => n.removeAttribute("data-selected"));
    if (!edit.enabled) return;
    if (edit.selected) document.querySelector(`[data-el="${edit.selected}"]`)?.setAttribute("data-selected", "");

    let drag: { el: HTMLElement; id: string; sx: number; sy: number; bx: number; by: number; moved: boolean } | null = null;
    const post = (m: PreviewMessage) => parent.postMessage(m, location.origin);
    const read = (el: HTMLElement, v: string) => parseFloat(el.style.getPropertyValue(v)) || 0;

    const down = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-el]") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      drag = { el, id: el.dataset.el!, sx: e.clientX, sy: e.clientY, bx: read(el, "--ex"), by: read(el, "--ey"), moved: false };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.sx;
      const dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      // ההזזה חלה רק בדסקטופ
      if (innerWidth < 1024) return;
      drag.moved = true;
      drag.el.setAttribute("data-dragging", "");
      const x = Math.max(-OFFSET_X, Math.min(OFFSET_X, Math.round(drag.bx + dx)));
      const y = Math.max(-OFFSET_Y, Math.min(OFFSET_Y, Math.round(drag.by + dy)));
      drag.el.style.setProperty("--ex", `${x}px`);
      drag.el.style.setProperty("--ey", `${y}px`);
    };
    const up = () => {
      if (!drag) return;
      const { el, id, moved } = drag;
      el.removeAttribute("data-dragging");
      if (moved) post({ type: "nk:move", id, x: read(el, "--ex"), y: read(el, "--ey") });
      post({ type: "nk:select", id });
      drag = null;
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
  }, [edit, version]);

  useEffect(() => {
    if (hash) document.getElementById(hash)?.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  const slug = pathname.match(/^\/work\/([^/]+)$/)?.[1];
  let view: React.ReactNode;
  if (pathname === "/") view = <HomeView c={c} />;
  else if (pathname === "/work") view = <WorkIndexView c={c} />;
  else if (slug && c.work.projects.some((p) => p.slug === slug && !p.hidden)) view = <ProjectView c={c} slug={slug} />;
  else if (pathname === "/accessibility") view = <AccessibilityView c={c} updated="אוקטובר 2026" />;
  else if (pathname === "/privacy" || pathname === "/terms") view = <LegalView c={c} id={pathname === "/privacy" ? "privacy" : "terms"} preview />;
  else view = <NotFoundView text={c.footer.notFound} />;

  return (
    <>
      {!embed && (
        <div className="preview-banner" role="status">
          <span>תצוגה מקדימה{revision ? " · גרסה מההיסטוריה" : " · טיוטה"}</span>
          <a href="/admin">חזרה לעריכה</a>
        </div>
      )}
      <SiteChrome c={c} watch={`${pathname}:${version}`}>
        {view}
      </SiteChrome>
    </>
  );
}
