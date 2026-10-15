# Natan Kosovsky — Portfolio + Studio

אתר פורטפוליו (Next.js 16, עברית RTL) עם מערכת ניהול מובנית ב-`/admin`.

## איך זה בנוי

- **התוכן הוא מסמך אחד מובנה** (`lib/content/types.ts`): טקסטים, עבודות, מדיה, צבעים, טיפוגרפיה ותנועה.
  יש שתי גרסאות: `draft` (מה שעורכים) ו-`published` (מה שהאתר מציג).
- **Guardrails** (`lib/content/limits.ts`, `normalize.ts`): כל ערך ויזואלי מוגבל לטווח מותר, כך שאי אפשר לשבור את העיצוב.
- **Design tokens** (`lib/theme.ts`): צבעים וטיפוגרפיה הופכים ל-CSS variables. ה-CSS של האתר קורא רק אותם.
- **האתר הציבורי** (`app/(site)`) קורא רק את `published`, דרך cache שמתרענן בכל Publish.
- **ה-Studio** (`app/admin`, `components/admin`): עורכים, Live Preview (האתר האמיתי ב-iframe שמקבל את הטיוטה ב-postMessage),
  autosave, undo/redo, ספריית מדיה, היסטוריית גרסאות.
- **מקור נתונים**: Supabase (DB + Auth + Storage). בלי Supabase, בפיתוח בלבד, הכל נשמר בקבצים בתיקיית `.data`.

## חיבור Supabase (פעם אחת)

1. **טבלאות והרשאות:** Supabase → SQL Editor → להדביק את `supabase/schema.sql` → Run.
2. **משתמש לנתן:** Authentication → Users → Add user (מייל + סיסמה).
3. **להפוך אותו לעורך:** להריץ ב-SQL Editor (עם המייל שלו):
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'natan@example.com';
   ```
4. **לסגור הרשמה חופשית:** Authentication → Sign In / Providers → לכבות "Allow new users to sign up".
   (גם אם מישהו נרשם, אין לו גישה, אבל אין סיבה להשאיר את זה פתוח.)
5. **משתני סביבה** (ב-`.env.local` לפיתוח, וב-Vercel → Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gpztqmtstepqpxwafwnr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...   (Project Settings → API → anon public)
   ```
   **לא** להכניס את ה-service_role key לשום מקום באתר.

בפעם הראשונה האתר מציג את תוכן ברירת המחדל (`lib/content/defaults.ts`). הפרסום הראשון מה-Studio שומר אותו ב-Supabase.

### כניסה ושחזור סיסמה
- הכניסה ל-`/admin`: **שם משתמש (המייל) וסיסמה**. המשתמש צריך להיות רשום גם ב-`admins`.
- **שכחתי סיסמה:** נשלח מייל עם קישור. הקישור פותח טופס סיסמה חדשה (לפחות 10 תווים).
- בשביל זה צריך להגדיר פעם אחת:
  1. Supabase → **Authentication → URL Configuration → Redirect URLs**: להוסיף `https://<הדומיין>/admin/reset/confirm`.
  2. ב-Vercel → **Environment Variables**: `NEXT_PUBLIC_SITE_URL=https://<הדומיין>` (בלי / בסוף). בלי זה איפוס סיסמה לא עובד בפרודקשן.

## פיתוח מקומי

```
npm install
npm run dev
```

בלי Supabase: להוסיף ל-`.env.local` שורה `ADMIN_DEV_PASSWORD=...` ולהיכנס ל-`/admin` עם הסיסמה הזו.
הנתונים נשמרים ב-`.data/` וההעלאות ב-`public/uploads/` (שתיהן לא נכנסות ל-git). מצב זה כבוי בפרודקשן.

### מצב בדיקה בלי סיסמה (מחשב מקומי בלבד)

`ADMIN_AUTH_DISABLED=1` ב-`.env.local` פותח את `/admin` בלי כניסה, ושומר בקבצים מקומיים (לא ב-Supabase).
עובד רק במחשב מקומי: ב-Vercel הוא כבוי תמיד, גם אם המשתנה הוגדר שם. למחוק את השורה כדי לחזור לכניסה עם Supabase.
להריץ עם `npm run dev`, כדי שתמונות שמעלים יוצגו מיד.

## אבטחה

- `/admin` ו-`/preview` בודקים הרשאה בשרת לפני כל דבר. כל פעולת כתיבה בודקת שוב, וב-Supabase גם RLS מאשר רק admins.
- הטיוטה לא נגישה לציבור: ה-RLS מאפשר לקרוא רק את `published`.
- `/admin` לא נטען בתוך אתרים אחרים, ו-`/preview` רק בתוך ה-Studio עצמו. שניהם `noindex`.
- העלאות: תמונות (JPG, PNG, WebP, AVIF, GIF) עד 15MB וסרטונים (MP4, WebM) עד 50MB. בלי SVG.

## הוספת סוג תוכן חדש בעתיד (Blog, Testimonials...)

1. טיפוס ב-`lib/content/types.ts` + ערך התחלתי ב-`defaults.ts`.
2. תצוגה ב-`components/site/views.tsx` (ו-`SectionId` אם זה אזור בדף הבית).
3. עורך חדש ב-`app/admin/(studio)/<name>/page.tsx` + קישור ב-`StudioShell.tsx`.

## נגישות

הצהרת הנגישות ב-`/accessibility` (תקנות שוויון זכויות + ת"י 5568 / WCAG 2.0 AA). לעדכן את התאריך בכל שינוי משמעותי.
