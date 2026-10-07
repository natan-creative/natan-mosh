import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { normalizeContent } from "@/lib/content/normalize";
import { getDraftContent, store } from "@/lib/store";
import { PreviewApp } from "@/components/admin/PreviewApp";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

async function PreviewGate({ searchParams }: { searchParams: PageProps<"/preview">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const rev = typeof sp.rev === "string" ? sp.rev : null;
  const content = rev ? normalizeContent(await store.readRevision(rev)) : await getDraftContent();
  return (
    <PreviewApp
      initial={content}
      embed={sp.embed === "1"}
      initialPath={typeof sp.path === "string" && sp.path.startsWith("/") ? sp.path : "/"}
      revision={rev}
    />
  );
}

export default function PreviewPage(props: PageProps<"/preview">) {
  return (
    <Suspense fallback={null}>
      <PreviewGate searchParams={props.searchParams} />
    </Suspense>
  );
}
