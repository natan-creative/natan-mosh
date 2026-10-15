import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdmin } from "@/lib/auth";
import { BACKEND, LOCAL_ADMIN_ALLOWED } from "@/lib/env";
import { LoginForm } from "@/components/admin/LoginForm";

async function Gate({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const sp = await searchParams;
  const mode = BACKEND === "supabase" ? "supabase" : LOCAL_ADMIN_ALLOWED && process.env.ADMIN_DEV_PASSWORD ? "local" : "unconfigured";
  return <LoginForm mode={mode} resetDone={sp.reset === "1"} />;
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  return (
    <main className="ad-login">
      <Suspense fallback={null}>
        <Gate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
