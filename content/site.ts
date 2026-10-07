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
  /** הסבר קצר, רק כשזה מוסיף */
  note?: string;
  image?: Media;
};

export const site = {
  name: "Natan Kosovsky",
  short: "NK",
  role: "Creative Director / Copywriter",
  email: "[natan@email.com]",
  phone: "[050-0000000]",
  linkedin: "[https://linkedin.com/in/...]",
  instagram: "[https://instagram.com/...]",
};

export const hero = {
  // שורת הפתיחה. החלק ב-struck נמחק בקו אדום. אפשר להשאיר struck ריק.
  line: { before: "לוקח בריף ומחזיר", struck: "פוסט", after: "רעיון." },
  // חלופות שעלו (להחליף ב-line אם בוחרים אחת מהן):
  // "רעיונות מתחילים בבריף. אני אוהב לראות לאן אפשר לקחת אותם."
  // "קריאייטיב מתחיל בשאלה טובה."
  // "אני מחפש את הרעיון שמצליח לגרום לאנשים לעצור."
  thoughts: ["BRIEF", "INSIGHT", "IDEA", "CONCEPT", "EXECUTION"],
};

// הקריצות הקטנות של האתר. לא יותר משלוש.
export const winks = {
  works: { idle: "אין כאן שום דבר חשוב.", reveal: "חוץ מהעבודות." },
  notFound: "הרעיון הזה עוד לא נכתב.",
};

const img = (name: string, alt: string): Media => ({ kind: "image", src: `/work/${name}.webp`, alt });

export const works: Work[] = [
  {
    slug: "bein-levein",
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
  { name: "tuk", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]", image: img("tuk", "לוגו tuk") },
  { name: "play", what: "[מותג / מוצר]", image: img("play", "כוס play") },
  { name: "NOVA", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]", image: img("nova", "NOVA על קיר בטון") },
  { name: "K", what: "[מותג / מוצר]", image: img("k-wall", "האות K על קיר") },
  { name: "GAIA", what: "[מותג / מוצר]", note: "[השם נולד מתוך...]", image: img("gaia", "GAIA, Natural beauty, real results") },
  { name: "ARGO", what: "[מותג / מוצר]", image: img("argo", "לוגו ARGO") },
];

export const about = {
  title: "קצת עליי.",
  // המשפט הגדול שמתגלה בגלילה. הצעה, לאשר עם נתן.
  statement: "אני אוהב רעיונות שאי אפשר להסביר בלי לספר את כל הסיפור.",
  body: [
    "נתי קוסובסקי הוא Creative Director / Copywriter עם ניסיון ביצירת רעיונות, קמפיינים, קונספטים ושפה למותגים.",
    "הוא אוהב לקחת בריף מוכר ולשאול: \"איך אפשר לעשות את זה אחרת?\"",
    "[הטקסט הסופי יוזן כאן: ניסיון, מקומות עבודה, מה הוא עושה היום.]",
  ],
  clients: ["[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]", "[לקוח]"],
};

export const contact = {
  headline: ["יש בריף?", "בוא נחשוב עליו."],
};

export const nav = [
  { href: "/#work", label: "עבודות" },
  { href: "/#digital", label: "דיגיטל" },
  { href: "/#naming", label: "Naming" },
  { href: "/#about", label: "אודות" },
  { href: "/#contact", label: "יצירת קשר" },
];
