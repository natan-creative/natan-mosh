import { Suspense } from "react";
import { ForgotForm } from "@/components/admin/ResetForms";

async function Page({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const sp = await searchParams;
  return <ForgotForm expired={sp.expired === "1"} />;
}

export default function ForgotPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  return (
    <main className="ad-login">
      <Suspense fallback={null}>
        <Page searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
