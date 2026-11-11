import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// הקישור מהמייל מגיע לכאן עם code. מחליפים אותו ב-session, ומעבירים לטופס הסיסמה החדשה
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/admin/forgot`);
  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/admin/forgot?expired=1`);
  return NextResponse.redirect(`${origin}/admin/reset/new`);
}
