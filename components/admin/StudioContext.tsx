"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { publish as publishAction, saveDraft, saveDraftCheckpoint } from "@/app/admin/actions";
import { changedAreas } from "@/lib/content/diff";
import type { MediaAsset, SiteContent } from "@/lib/content/types";

export type SaveState = "saved" | "pending" | "saving" | "error";
export type Device = "desktop" | "tablet" | "mobile";

type History = { past: SiteContent[]; present: SiteContent; future: SiteContent[] };

type Studio = {
  content: SiteContent;
  published: SiteContent;
  /** שינוי בטיוטה. recipe מקבל עותק לשינוי. key מאחד הקלדות רצופות לצעד undo אחד. */
  update: (recipe: (draft: SiteContent) => void, key?: string) => void;
  replace: (c: SiteContent) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveState: SaveState;
  retrySave: () => void;
  changes: (keyof SiteContent)[];
  saveCheckpoint: () => Promise<boolean>;
  publish: () => Promise<boolean>;
  media: MediaAsset[];
  setMedia: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  previewPath: string;
  setPreviewPath: (path: string) => void;
  device: Device;
  setDevice: (d: Device) => void;
  backend: "supabase" | "local";
  notify: (msg: string) => void;
  toast: string | null;
};

const Ctx = createContext<Studio | null>(null);

export function useStudio() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStudio outside StudioProvider");
  return s;
}

const HISTORY_LIMIT = 100;
const COALESCE_MS = 900;
const AUTOSAVE_MS = 900;

export function StudioProvider({
  initialDraft,
  initialPublished,
  initialMedia,
  backend,
  children,
}: {
  initialDraft: SiteContent;
  initialPublished: SiteContent;
  initialMedia: MediaAsset[];
  backend: "supabase" | "local";
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<History>({ past: [], present: initialDraft, future: [] });
  const [published, setPublished] = useState(initialPublished);
  const [media, setMedia] = useState(initialMedia);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [previewPath, setPreviewPath] = useState("/");
  const [device, setDevice] = useState<Device>("desktop");
  const [toast, setToast] = useState<string | null>(null);

  const last = useRef({ key: "", at: 0 });
  const savedJson = useRef(JSON.stringify(initialDraft));
  const content = history.present;

  const update = useCallback((recipe: (d: SiteContent) => void, key = "") => {
    // מחוץ ל-updater: React עשוי להריץ אותו פעמיים
    const now = Date.now();
    const coalesce = Boolean(key) && key === last.current.key && now - last.current.at < COALESCE_MS;
    last.current = { key, at: now };
    setHistory((h) => {
      const next = structuredClone(h.present);
      recipe(next);
      return {
        past: coalesce ? h.past : [...h.past, h.present].slice(-HISTORY_LIMIT),
        present: next,
        future: [],
      };
    });
  }, []);

  const replace = useCallback((c: SiteContent) => {
    last.current = { key: "", at: 0 };
    setHistory((h) => ({ past: [...h.past, h.present].slice(-HISTORY_LIMIT), present: c, future: [] }));
  }, []);

  const undo = useCallback(() => {
    last.current = { key: "", at: 0 };
    setHistory((h) => (h.past.length ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] } : h));
  }, []);

  const redo = useCallback(() => {
    last.current = { key: "", at: 0 };
    setHistory((h) => (h.future.length ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) } : h));
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  // ---------- Autosave ----------
  const saveNow = useCallback(async (c: SiteContent) => {
    const json = JSON.stringify(c);
    if (json === savedJson.current) return setSaveState("saved");
    setSaveState("saving");
    const res = await saveDraft(c);
    if (res.ok) {
      savedJson.current = json;
      setSaveState((s) => (s === "saving" ? "saved" : s));
    } else {
      setSaveState("error");
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(content) === savedJson.current) return;
    setSaveState("pending");
    const t = window.setTimeout(() => saveNow(content), AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [content, saveNow]);

  // לא לאבד שינויים שעוד לא נשמרו
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveState === "pending" || saveState === "saving" || saveState === "error") e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [saveState]);

  // Undo / Redo מהמקלדת (מחוץ לשדות טקסט, שם יש undo של הדפדפן)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const saveCheckpoint = useCallback(async () => {
    setSaveState("saving");
    const res = await saveDraftCheckpoint(content);
    if (!res.ok) {
      setSaveState("error");
      notify(res.error);
      return false;
    }
    savedJson.current = JSON.stringify(content);
    setSaveState("saved");
    notify("הטיוטה נשמרה ✓");
    return true;
  }, [content, notify]);

  const publish = useCallback(async () => {
    setSaveState("saving");
    const res = await publishAction(content);
    if (!res.ok) {
      setSaveState("error");
      notify(res.error);
      return false;
    }
    savedJson.current = JSON.stringify(content);
    setPublished(res.data);
    setSaveState("saved");
    notify("פורסם ✓");
    return true;
  }, [content, notify]);

  const changes = useMemo(() => changedAreas(published, content), [published, content]);

  const value: Studio = {
    content,
    published,
    update,
    replace,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    saveState,
    retrySave: () => saveNow(content),
    changes,
    saveCheckpoint,
    publish,
    media,
    setMedia,
    previewPath,
    setPreviewPath,
    device,
    setDevice,
    backend,
    notify,
    toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** כל עורך מודיע לאיזה עמוד ה-Preview צריך לעבור */
export function usePreviewPath(path: string) {
  const { setPreviewPath } = useStudio();
  useEffect(() => setPreviewPath(path), [path, setPreviewPath]);
}
