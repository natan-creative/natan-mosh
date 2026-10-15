import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { BACKEND } from "@/lib/env";
import { NewPasswordForm } from "@/components/admin/ResetForms";

// בלי session מקישור איפוס תקף: חוזרים לבקשת קישור חדש
export default async function NewPasswordPage() {
  if (BACKEND !== "supabase") redirect("/admin/login");
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/forgot?expired=1");
  return (
    <main className="ad-login">
      <NewPasswordForm />
    </main>
  );
}
