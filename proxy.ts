import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// מרענן את ה-session של Supabase בכל בקשה ל-Admin ול-Preview.
// (ההרשאה עצמה נבדקת בשרת, ב-requireAdmin וב-RLS. זה רק שומר שה-session לא יפוג.)
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const sb = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await sb.auth.getUser();
  return response;
}

export const config = { matcher: ["/admin/:path*", "/preview"] };
