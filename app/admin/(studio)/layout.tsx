import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { AUTH_DISABLED, BACKEND } from "@/lib/env";
import { builtinMedia, getDraftContent, getPublishedContent, store } from "@/lib/store";
import { StudioProvider } from "@/components/admin/StudioContext";
import { StudioShell } from "@/components/admin/StudioShell";
import { ConfirmProvider } from "@/components/admin/ui";

async function Gate({ children }: { children: React.ReactNode }) {
  // בדיקת ההרשאה בשרת, לפני שנטען משהו מהטיוטה
  const admin = await requireAdmin();
  const [draft, published, media] = await Promise.all([getDraftContent(), getPublishedContent(), store.listMedia()]);
  return (
    <ConfirmProvider>
      <StudioProvider initialDraft={draft} initialPublished={published} initialMedia={[...media, ...builtinMedia]} backend={BACKEND}>
        <StudioShell email={admin.email} authDisabled={AUTH_DISABLED}>{children}</StudioShell>
      </StudioProvider>
    </ConfirmProvider>
  );
}

export default function StudioLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="ad-loading">פותח את הסטודיו…</div>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
