"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { SiteChrome } from "@/components/site/SiteChrome";
import { AccessibilityView, HomeView, NotFoundView, ProjectView, WorkIndexView } from "@/components/site/views";

// ה-Preview מציג את האתר האמיתי עם הטיוטה. בתוך ה-Admin (embed) הוא מקבל עדכונים חיים ב-postMessage.
export type PreviewMessage =
  | { type: "nk:content"; content: SiteContent }
  | { type: "nk:navigate"; path: string }
  | { type: "nk:ready" }
  | { type: "nk:path"; path: string };

export function PreviewApp({ initial, embed, initialPath, revision }: { initial: SiteContent; embed: boolean; initialPath: string; revision: string | null }) {
  const [c, setC] = useState(initial);
  const [path, setPath] = useState(initialPath);
  const [version, setVersion] = useState(0);
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
    };
    // קישורים פנימיים לא עוזבים את ה-Preview: מחליפים את העמוד המוצג
    const onClick = (e: MouseEvent) => {
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
  else view = <NotFoundView text={c.footer.notFound} />;

  return (
    <>
      {!embed && (
        <div className="preview-banner" role="status">
          <span>PREVIEW MODE{revision ? " · גרסה מההיסטוריה" : " · טיוטה"}</span>
          <a href="/admin">חזרה לעריכה</a>
        </div>
      )}
      <SiteChrome c={c} watch={`${pathname}:${version}`}>
        {view}
      </SiteChrome>
    </>
  );
}
