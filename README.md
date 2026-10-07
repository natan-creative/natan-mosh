# Natan Kosovsky — Portfolio

Next.js, עברית RTL. כל התוכן נמצא בקובץ אחד: `content/site.ts`.

## עדכון תוכן
- טקסטים: `content/site.ts` (כל מה שבסוגריים מרובעים `[...]` מחכה לתוכן)
- תמונות עבודות: `public/work/` ← ובקובץ התוכן: `{ kind: "image", src: "/work/file.jpg", alt: "..." }`
- לוגואים: `public/logos/` ← ובכרטיס הדיגיטל: `logo: "/logos/client.svg"`
- וידאו מיוטיוב/וימאו: `{ kind: "embed", src: "https://player.vimeo.com/video/..." }`

## הרצה מקומית
```
npm install
npm run dev
```

## Supabase (טופס יצירת קשר)
1. להריץ את `supabase/schema.sql` ב-SQL Editor של הפרויקט.
2. להעתיק את `.env.example` ל-`.env.local` ולמלא את ה-anon key (Project Settings → API).
3. ב-Vercel: Settings → Environment Variables, להוסיף את אותם שני משתנים.

בלי המשתנים האלה הטופס פשוט לא מוצג, ונשאר קישור מייל.
ההודעות מופיעות ב-Supabase: Table Editor → `contact_messages`.

## Deploy
Vercel מחובר ל-repo, כל push ל-`main` מעלה גרסה חדשה.
