# Natan Kosovsky — Portfolio

Next.js, עברית RTL. כל התוכן נמצא בקובץ אחד: `content/site.ts`.

## עדכון תוכן
הכל ב-`content/site.ts`. כל מה שבסוגריים מרובעים `[...]` מחכה לתוכן.

- **עבודות (Selected Work):** כל עבודה היא אובייקט. `type: "case"` מקבלת Case Study מלא
  (Brief / Challenge / Idea / Execution / Result), `type: "idea"` מקבלת עמוד קצר.
  `kind` הוא מה שמופיע מתחת לכרטיס (קמפיין / קונספט), `focus` קובע איזה חלק מהתמונה
  נשאר בחיתוך לכרטיס, `accent` הוא צבע הפרויקט בעמוד ה-Case.
- **תמונות:** לשים ב-`public/work/` ולהפנות: `img("file-name", "תיאור לנגישות")`.
  next/image דואג ל-AVIF/WebP ולגדלים.
- **לוגואים:** `public/logos/` ← בכרטיס דיגיטל: `face: "logo", logo: "/logos/client.svg"`.
- **וידאו:** `{ kind: "embed", src: "https://player.vimeo.com/video/..." }`.
- **Hero:** `hero.headline` (הכותרת באנגלית), `hero.note` (הפתק בכתב יד), `hero.image`.
- **Naming:** כל שם מקבל `style` שקובע איך ה-wordmark נראה (`black` / `heavy` / `serif` / `spaced` / `wide`).
  ארבעה ראשונים מוצגים, השאר נפתחים ב"לכל השמות".
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
