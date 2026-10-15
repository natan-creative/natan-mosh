import { redirect } from "next/navigation";
import { Suspense } from "react";
import { supabaseServer } from "@/lib/supabase/server";
import { BACKEND } from "@/lib/env";
import { NewPasswordForm } from "@/components/admin/ResetForms";

// בלי session מקישור איפוס תקף: חוזרים לבקשת קישור חדש.
// הבדיקה נעשית בתוך Suspense, כי היא קוראת קוקי של המשתמש ולא נבנית מראש.
async function Gate() {
  if (BACKEND !== "supabase") redirect("/admin/login");
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/forgot?expired=1");
  return <NewPasswordForm />;
}

export default function NewPasswordPage() {
  return (
    <main className="ad-login">
      <Suspense fallback={null}>
        <Gate />
      </Suspense>
    </main>
  );
}
