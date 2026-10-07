import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdmin } from "@/lib/auth";
import { BACKEND, LOCAL_ADMIN_ALLOWED } from "@/lib/env";
import { LoginForm } from "@/components/admin/LoginForm";

async function Gate() {
  if (await getAdmin()) redirect("/admin");
  const mode = BACKEND === "supabase" ? "supabase" : LOCAL_ADMIN_ALLOWED && process.env.ADMIN_DEV_PASSWORD ? "local" : "unconfigured";
  return <LoginForm mode={mode} />;
}

export default function LoginPage() {
  return (
    <main className="ad-login">
      <Suspense fallback={null}>
        <Gate />
      </Suspense>
    </main>
  );
}
