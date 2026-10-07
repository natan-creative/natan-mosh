# Natan Kosovsky — Portfolio

Next.js, עברית RTL. כל התוכן נמצא בקובץ אחד: `content/site.ts`.

## עדכון תוכן
הכל ב-`content/site.ts`. כל מה שבסוגריים מרובעים `[...]` מחכה לתוכן.

- **עבודות (Selected Work):** כל עבודה היא אובייקט. `type: "case"` מקבלת Case Study מלא
  (Brief / Challenge / Idea / Execution / Result), `type: "idea"` מקבלת עמוד קצר.
  `layout` קובע את המקום בגריד (`major` / `side` / `mid` / `small`), `ratio` את יחס התמונה,
  `accent` את צבע הפרויקט.
- **תמונות:** לשים ב-`public/work/` ולהפנות: `img("file-name", "תיאור לנגישות")`.
  next/image דואג ל-AVIF/WebP ולגדלים.
- **לוגואים:** `public/logos/` ← בכרטיס דיגיטל: `face: "logo", logo: "/logos/client.svg"`.
- **וידאו:** `{ kind: "embed", src: "https://player.vimeo.com/video/..." }`.
- **Hero:** `hero.line` (החלק ב-`struck` נמחק בקו אדום), חלופות בהערה.
- **קריצות:** `winks`. לא יותר משלוש.

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
