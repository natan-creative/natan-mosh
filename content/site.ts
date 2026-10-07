// כל התוכן של האתר במקום אחד.
// טקסטים בסוגריים מרובעים [...] הם placeholders שמחכים לחומרים מנתן.

export type Media =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; poster?: string; caption?: string }
  | { kind: "embed"; src: string; caption?: string } // YouTube / Vimeo
  | { kind: "placeholder"; label: string; ratio?: "wide" | "square" | "tall" };

export type Work = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year?: string;
  role?: string;
  /** case = עמוד Case Study מלא, idea = רעיון קצר שמוצג בתוך הרשימה */
  type: "case" | "idea";
  summary: string;
  cover: Media;
  brief?: string;
  insight?: string;
  idea?: string;
  execution?: string;
  results?: string[];
  gallery?: Media[];
};

export type DigitalWork = {
  client: string;
  logo?: string; // נתיב ללוגו בתיקיית public/logos
  title: string;
  problem: string;
  idea: string;
  execution: string;
  media?: Media;
};

export type Name = {
  name: string;
  what: string; // מה זה: מותג, מוצר, סדרה...
  note?: string; // הסבר קצר, רק כשזה מוסיף
};

export const site = {
  name: "Natan Kosovsky",
  role: "Creative Director / Copywriter",
  // שורת פתיחה. לא סלוגן, תיאור. כמה חלופות בהערה למטה.
  intro: {
    before: "לוקח בריף ומחזיר",
    struck: "פוסט",
    after: "רעיון.",
  },
  // חלופות לשורת הפתיחה:
  // "רוב העבודה קורית לפני שיש מה להראות."
  // "קופי, קונספט, ומה שביניהם."
  email: "[natan@email.com]",
  phone: "[050-0000000]",
  linkedin: "[https://linkedin.com/in/...]",
  instagram: "",
};

export const works: Work[] = [
  {
    slug: "bein-levein",
    title: "בין לבין",
    subtitle: "לנפח סופרלטיבים",
    client: "[לקוח]",
    year: "[שנה]",
    role: "קריאייטיב / קופי",
    type: "case",
    summary: "[משפט אחד שמסכם את המהלך: מה הייתה הבעיה ומה הרעיון שפתר אותה.]",
    cover: { kind: "placeholder", label: "בין לבין — Key visual", ratio: "wide" },
    brief: "[מה הלקוח ביקש. בשתיים-שלוש שורות.]",
    insight: "[התובנה שממנה הכל התחיל.]",
    idea: "[הרעיון עצמו, במשפט אחד חד. ואחריו פסקה קצרה שמרחיבה.]",
    execution: "[איך זה יצא לעולם: פלטפורמות, פורמטים, ביצועים בולטים.]",
    results: ["[תוצאה / מספר]", "[תוצאה / מספר]"],
    gallery: [
      { kind: "placeholder", label: "סרט / וידאו", ratio: "wide" },
      { kind: "placeholder", label: "תמונה", ratio: "square" },
      { kind: "placeholder", label: "תמונה", ratio: "square" },
    ],
  },
  {
    slug: "mycal",
    title: "כ.א.ל",
    subtitle: "קמפיין MyCAL",
    client: "כ.א.ל",
    year: "[שנה]",
    role: "קריאייטיב / קופי",
    type: "case",
    summary: "[משפט אחד שמסכם את המהלך.]",
    cover: { kind: "placeholder", label: "MyCAL — Key visual", ratio: "wide" },
    brief: "[מה הלקוח ביקש.]",
    insight: "[התובנה.]",
    idea: "[הרעיון.]",
    execution: "[הביצוע.]",
    results: ["[תוצאה / מספר]"],
    gallery: [
      { kind: "placeholder", label: "סרט / וידאו", ratio: "wide" },
      { kind: "placeholder", label: "תמונה", ratio: "square" },
      { kind: "placeholder", label: "תמונה", ratio: "square" },
    ],
  },
  {
    slug: "branding-god",
    title: "ממתגים את אלוהים",
    subtitle: "[תת-כותרת]",
    client: "[לקוח / יוזמה אישית]",
    year: "[שנה]",
    type: "idea",
    summary: "[רעיון קצר: שניים-שלושה משפטים שמסבירים את הרעיון ולמה הוא עובד.]",
    cover: { kind: "placeholder", label: "ממתגים את אלוהים", ratio: "wide" },
  },
  {
    slug: "milky-upside-down",
    title: "מילקי הפוך",
    subtitle: "[תת-כותרת]",
    client: "מילקי",
    year: "[שנה]",
    type: "idea",
    summary: "[רעיון קצר: שניים-שלושה משפטים שמסבירים את הרעיון ולמה הוא עובד.]",
    cover: { kind: "placeholder", label: "מילקי הפוך", ratio: "wide" },
  },
];

const digitalPlaceholder = (n: number): DigitalWork => ({
  client: `[לקוח ${n}]`,
  title: "[שם העבודה]",
  problem: "[מה היה צריך לפתור]",
  idea: "[הרעיון במשפט]",
  execution: "[מה יצא בפועל]",
});

export const digital: DigitalWork[] = Array.from({ length: 12 }, (_, i) =>
  digitalPlaceholder(i + 1),
);

export const names: Name[] = [
  { name: "[שם]", what: "[מותג / מוצר]", note: "[למה דווקא השם הזה]" },
  { name: "[שם]", what: "[מותג / מוצר]" },
  { name: "[שם]", what: "[מותג / מוצר]", note: "[למה דווקא השם הזה]" },
  { name: "[שם]", what: "[מותג / מוצר]" },
  { name: "[שם]", what: "[מותג / מוצר]" },
  { name: "[שם]", what: "[מותג / מוצר]", note: "[למה דווקא השם הזה]" },
];

export const about = {
  lead: "[משפט אחד על מי אני. לא תואר, משהו שנשמע כמוני.]",
  body: [
    "[כמה שורות על הדרך: איפה עבדתי, על אילו מותגים, מה למדתי.]",
    "[מה אני עושה היום ומה מעניין אותי לעשות.]",
  ],
  clients: ["[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]"],
};
