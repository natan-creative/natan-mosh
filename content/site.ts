// כל התוכן של האתר במקום אחד.
// טקסטים בסוגריים מרובעים [...] הם placeholders שמחכים לחומרים מנתן.

export type Media =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; poster?: string; caption?: string }
  | { kind: "embed"; src: string; caption?: string } // YouTube / Vimeo (player URL)
  | { kind: "placeholder"; label: string };

/** יחסי תמונה שהגריד יודע להציג */
export type Ratio = `${number}/${number}`;

export type Work = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  /** מה שמופיע מתחת לכרטיס: קמפיין / קונספט */
  kind: string;
  client: string;
  year?: string;
  role?: string;
  /** צבע ה-accent של הפרויקט. נכנס רק כשנמצאים בתוך הפרויקט / ב-hover. */
  accent: string;
  /** case = Case Study מלא. idea = רעיון קצר: עמוד קצר יותר. */
  type: "case" | "idea";
  /** המיקום בגריד של Selected Work */
  layout: "major" | "side" | "mid" | "small";
  ratio: Ratio;
  summary: string;
  cover: Media;
  /** נקודת המיקוד של תמונת השער כשהיא נחתכת לכרטיס, למשל "20% 50%" */
  focus?: string;
  brief?: string;
  challenge?: string;
  idea?: string;
  ideaMore?: string;
  execution?: string;
  result?: string;
  stats?: string[];
  gallery?: { media: Media; ratio: Ratio; span?: "full" | "half" }[];
};

export type DigitalWork = {
  client: string;
  /** נתיב ללוגו בתיקיית public/logos */
  logo?: string;
  title: string;
  /** מה רואים על הכרטיס לפני hover: לוגו, כותרת גדולה (headline) או ויז'ואל */
  face: "logo" | "headline" | "visual";
  headline?: string;
  media?: Media;
  problem: string;
  idea: string;
  execution: string;
  accent?: string;
};

export type Name = {
  name: string;
  what: string;
  /** איך השם נראה כ-wordmark */
  style: "black" | "heavy" | "serif" | "spaced" | "wide";
  /** הסבר קצר, רק כשזה מוסיף */
  note?: string;
};

export const site = {
  name: "Natan Kosovsky",
  short: "NK",
  role: "Creative Director / Copywriter",
  email: "[natan@email.com]",
  phone: "054-476-6060",
  phoneIntl: "+972544766060",
  whatsapp: {
    number: "972544766060",
    message: "היי נתן, הגעתי מהאתר שלך",
  },
  linkedin: "[https://linkedin.com/in/...]",
  instagram: "[https://instagram.com/...]",
};

export const hero = {
  headline: ["GOOD IDEAS", "DON\u2019T HAPPEN", "BY ACCIDENT."],
  // הפתק בכתב יד ליד התמונה
  note: ["רק רעיונות", "טובים", "מייצרים", "תנועה."],
  image: { kind: "image", src: "/work/hero-crown.webp", alt: "נתן מגבו, עם כתר צהוב מצויר מעל הראש" } as Media,
};

// הקריצות הקטנות של האתר. לא יותר משלוש.
export const winks = {
  footer: { idle: "אין כאן שום דבר חשוב.", reveal: "חוץ מהעבודות." },
  notFound: "הרעיון הזה עוד לא נכתב.",
};

const img = (name: string, alt: string): Media => ({ kind: "image", src: `/work/${name}.webp`, alt });

export const works: Work[] = [
  {
    slug: "bein-levein",
    kind: "קמפיין",
    title: "בין לבין",
    subtitle: "לנפח סופרלטיבים",
    category: "Campaign",
    client: "[לקוח]",
    year: "[שנה]",
    role: "Creative / Copy",
    accent: "#e8452c",
    type: "case",
    layout: "major",
    ratio: "4/5",
    summary: "[משפט אחד שמסכם את המהלך: מה הייתה הבעיה ומה הרעיון שפתר אותה.]",
    cover: img("bein-levein", "שקית של בין לבין עם הקופי: לנפח סופרלטיבים"),
    brief: "[מה הלקוח ביקש. בשתיים-שלוש שורות.]",
    challenge: "[מה באמת היה צריך לפתור. הבעיה שמתחת לבריף.]",
    idea: "[הרעיון עצמו, במשפט אחד חד.]",
    ideaMore: "[פסקה קצרה שמרחיבה על הרעיון ולמה הוא עובד.]",
    execution: "[איך הרעיון הפך למהלך: פלטפורמות, פורמטים, ביצועים בולטים.]",
    result: "[מה יצא מזה.]",
    stats: ["[מספר]", "[מספר]", "[מספר]"],
    gallery: [
      { media: { kind: "placeholder", label: "סרט / וידאו" }, ratio: "16/9", span: "full" },
      { media: { kind: "placeholder", label: "ביצוע" }, ratio: "4/5", span: "half" },
      { media: { kind: "placeholder", label: "ביצוע" }, ratio: "4/5", span: "half" },
    ],
  },
  {
    slug: "mycal",
    kind: "קמפיין",
    title: "כ.א.ל",
    subtitle: "קמפיין MyCAL",
    category: "Campaign",
    client: "כ.א.ל",
    year: "[שנה]",
    role: "Creative / Copy",
    accent: "#1f4fd8",
    type: "case",
    layout: "side",
    ratio: "4/3",
    summary: "[משפט אחד שמסכם את המהלך.]",
    cover: img("mycal-billboard", "שלט חוצות של MyCAL: כבר לא סתם כרטיס"),
    brief: "[מה הלקוח ביקש.]",
    challenge: "[מה באמת היה צריך לפתור.]",
    idea: "[הרעיון, במשפט אחד.]",
    ideaMore: "[הרחבה קצרה.]",
    execution: "[הביצוע.]",
    result: "[מה יצא מזה.]",
    stats: ["[מספר]", "[מספר]"],
    gallery: [
      { media: img("mycal-wall", "פוסטרים של MyCAL על קיר ברחוב"), ratio: "16/9", span: "full" },
      { media: img("mycal-paper", "MyCAL: כבר לא סתם כרטיס"), ratio: "3/4", span: "half" },
      { media: { kind: "placeholder", label: "ביצוע" }, ratio: "3/4", span: "half" },
    ],
  },
  {
    slug: "branding-god",
    kind: "קונספט",
    title: "ממתגים את אלוהים",
    subtitle: "מותג. אמונה. קהילה.",
    category: "Idea",
    client: "[לקוח / יוזמה אישית]",
    year: "[שנה]",
    accent: "#8a6cff",
    type: "idea",
    layout: "mid",
    ratio: "1/1",
    summary: "[רעיון קצר: שניים-שלושה משפטים שמסבירים את הרעיון ולמה הוא עובד.]",
    cover: img("branding-god", "שלט חוצות לילי: ממתגים את אלוהים. מותג. אמונה. קהילה."),
    idea: "[הרעיון, במשפט אחד.]",
    gallery: [
      { media: { kind: "placeholder", label: "ויז'ואל" }, ratio: "4/5", span: "half" },
      { media: { kind: "placeholder", label: "ויז'ואל" }, ratio: "4/5", span: "half" },
    ],
  },
  {
    slug: "milky-upside-down",
    kind: "קמפיין",
    title: "מילקי הפוך",
    subtitle: "[תת-כותרת]",
    category: "Idea",
    client: "מילקי",
    year: "[שנה]",
    accent: "#f2c200",
    type: "idea",
    layout: "small",
    ratio: "5/4",
    summary: "[רעיון קצר: שניים-שלושה משפטים שמסבירים את הרעיון ולמה הוא עובד.]",
    cover: img("milky", "שלט חוצות צהוב: מילקי הפוך, עם כוס מילקי ביד"),
    focus: "22% 50%",
    idea: "[הרעיון, במשפט אחד.]",
    gallery: [{ media: { kind: "placeholder", label: "ויז'ואל" }, ratio: "16/9", span: "full" }],
  },
];

const digitalImages: [string, string][] = [
  ["phone-coffee", "אפליקציה בטלפון: פשוט לשפר את הבוקר"],
  ["question", "איך גורמים לאנשים לעצור?"],
  ["poster-idea", "פוסטר ברחוב: לא כל מה שגדול הוא רעיון"],
  ["crown", "כתר מצויר על בד צהוב"],
  ["ideas-build", "Ideas build brands"],
  ["tuk-bag", "אריזה סגולה של tuk"],
  ["k-train", "לוגו K בתחנת רכבת"],
  ["gaia-box", "קופסת GAIA"],
  ["play", "כוס play סגולה"],
  ["sticky", "פתק צהוב: רעיון טוב מתחיל בשאלה פשוטה"],
  ["big-ideas", "Big ideas, small egos"],
  ["phone-brief", "טלפון: יש בריף? בוא נחשוב עליו"],
];

export const digital: DigitalWork[] = digitalImages.map(([file, alt], i) => ({
  client: `[לקוח ${i + 1}]`,
  title: "[שם העבודה]",
  face: "visual",
  media: img(file, alt),
  problem: "[מה היה צריך לפתור]",
  idea: "[הרעיון במשפט]",
  execution: "[מה יצא בפועל]",
}));

export const names: Name[] = [
  { name: "tuk", style: "black", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]" },
  { name: "פולס", style: "heavy", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]" },
  { name: "GAIA", style: "serif", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]" },
  { name: "NOVA", style: "spaced", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]" },
  { name: "play", style: "black", what: "[מותג / מוצר]" },
  { name: "ARGO", style: "wide", what: "[מותג / מוצר]" },
  { name: "K", style: "serif", what: "[מותג / מוצר]" },
];

export const about = {
  // מתוך המוקאפ. לאמת עם נתן (במיוחד ה-15+).
  body: [
    "אני נתן קוסובסקי, קריאייטיב דיירקטור וכותב.",
    "15+ שנות ניסיון בעבודה עם מותגים, חברות וסטארטאפים.",
    "עובד היום עם מותגים שמאמינים בכוח של רעיון טוב.",
  ],
};

export const nav = [
  { href: "/#work", label: "עבודות" },
  { href: "/#digital", label: "דיגיטל" },
  { href: "/#naming", label: "שמות" },
  { href: "/#about", label: "אודות" },
  { href: "/#contact", label: "צור קשר" },
];
