// Design-system guardrails: מה מותר לשנות ובאיזה טווח. גם ה-UI וגם normalize משתמשים בזה.
import type { ButtonStyle, ColorTokens, ElementId, FontId, PresetId, Theme, TypeRole } from "./types";

export const FONTS: Record<FontId, { label: string; cssVar: string; weights: number[]; hebrew: boolean }> = {
  bebas: { label: "Bebas Neue (אנגלית בלבד)", cssVar: "--font-cond", weights: [400], hebrew: false },
  heebo: { label: "Heebo", cssVar: "--font-body", weights: [400, 500, 600, 700, 800], hebrew: true },
  rubik: { label: "Rubik", cssVar: "--font-rubik", weights: [400, 500, 600, 700, 800], hebrew: true },
  frank: { label: "Frank Ruhl Libre (סריף)", cssVar: "--font-serif", weights: [400, 500, 700], hebrew: true },
  secular: { label: "Secular One", cssVar: "--font-heavy", weights: [400], hebrew: true },
  gveret: { label: "Gveret Levin (כתב יד)", cssVar: "--font-hand", weights: [400], hebrew: true },
};

export const ALL_WEIGHTS = [400, 500, 600, 700, 800] as const;

type Range = { min: number; max: number; step: number };

export const TYPE_LIMITS: Record<TypeRole, { label: string; hint: string; size: Range; fonts: FontId[] }> = {
  display: { label: "כותרת ראשית", hint: "GOOD IDEAS... בפתיחה, וכותרות ענק באנגלית", size: { min: 40, max: 160, step: 1 }, fonts: ["bebas", "heebo", "rubik", "frank", "secular"] },
  heading: { label: "כותרות אזורים", hint: "SELECTED WORK, NAMING, ABOUT", size: { min: 20, max: 72, step: 1 }, fonts: ["bebas", "heebo", "rubik", "frank", "secular"] },
  title: { label: "כותרות עבודה", hint: "שם העבודה בעמוד ה-Case ו'הרעיון'", size: { min: 32, max: 160, step: 1 }, fonts: ["heebo", "rubik", "frank", "secular"] },
  body: { label: "טקסט רץ", hint: "פסקאות, תיאורים, כפתורים", size: { min: 14, max: 22, step: 1 }, fonts: ["heebo", "rubik", "frank"] },
  caption: { label: "טקסט קטן", hint: "קטגוריות, תוויות, פוטר", size: { min: 11, max: 16, step: 1 }, fonts: ["heebo", "rubik"] },
  hand: { label: "כתב יד", hint: "הפתק ליד התמונה בפתיחה", size: { min: 20, max: 64, step: 1 }, fonts: ["gveret", "heebo", "frank"] },
};

export const LINE_HEIGHT = { min: 0.8, max: 2, step: 0.05 };
export const LETTER_SPACING = { min: -0.05, max: 0.2, step: 0.005 };

export const DIGITAL_COLUMNS = {
  desktop: { min: 2, max: 8 },
  tablet: { min: 2, max: 4 },
  mobile: { min: 1, max: 3 },
};

export const WORK_COLUMNS = { min: 2, max: 4 };

export const ZOOM = { min: 1, max: 2, step: 0.05 };

export const BUTTON_LIMITS = {
  radius: { min: 0, max: 40, step: 1 },
  paddingX: { min: 10, max: 48, step: 1 },
  paddingY: { min: 6, max: 24, step: 1 },
  fontSize: { min: 12, max: 20, step: 1 },
  letterSpacing: { min: -0.02, max: 0.2, step: 0.005 },
  borderWidth: { min: 0, max: 3, step: 1 },
  weights: [400, 500, 600, 700, 800],
};

export const defaultButtons: ButtonStyle = {
  radius: 0,
  paddingX: 26,
  paddingY: 13,
  fontSize: 15,
  weight: 600,
  uppercase: false,
  letterSpacing: 0,
  borderWidth: 1,
  shadow: "none",
  hover: "darken",
};

/** כמה רחוק אפשר להזיז אלמנט מהמקום הטבעי שלו (פיקסלים, בדסקטופ) */
export const OFFSET = { x: 480, y: 360 };

export const ELEMENTS: { id: ElementId; label: string; group: string; path: string; hideHint?: string }[] = [
  { id: "hero.headline", label: "כותרת ראשית", group: "פתיחה", path: "/" },
  { id: "hero.note", label: "פתק בכתב יד", group: "פתיחה", path: "/" },
  { id: "hero.arrow", label: "החץ", group: "פתיחה", path: "/" },
  { id: "hero.photo", label: "התמונה", group: "פתיחה", path: "/" },
  { id: "hero.rule", label: "הקו הקצר", group: "פתיחה", path: "/" },
  { id: "hero.role", label: "התפקיד", group: "פתיחה", path: "/" },
  { id: "hero.cta", label: "הכפתור", group: "פתיחה", path: "/" },
  { id: "work.head", label: "כותרת העבודות", group: "דף הבית", path: "/#work" },
  { id: "digital.intro", label: "הטקסט בסושיאל", group: "דף הבית", path: "/#digital" },
  { id: "naming.head", label: "כותרת השמות", group: "דף הבית", path: "/#naming" },
  { id: "about.text", label: "טקסט אודות", group: "אודות ויצירת קשר", path: "/#about" },
  { id: "about.image", label: "הלוגו באודות", group: "אודות ויצירת קשר", path: "/#about" },
  { id: "contact.block", label: "פרטי הקשר", group: "אודות ויצירת קשר", path: "/#contact" },
  { id: "contact.form", label: "טופס יצירת קשר", group: "אודות ויצירת קשר", path: "/#contact" },
  { id: "footer.wink", label: "הקריצה בתחתית", group: "אודות ויצירת קשר", path: "/#contact" },
  { id: "fab.whatsapp", label: "כפתור וואטסאפ", group: "כפתורים צפים", path: "/" },
  { id: "fab.a11y", label: "כפתור נגישות", group: "כפתורים צפים", path: "/", hideHint: "לא חובה לפי החוק, אבל מקובל. מומלץ להשאיר." },
];

export const RATIOS: { value: `${number}/${number}`; label: string }[] = [
  { value: "16/9", label: "רחב 16:9" },
  { value: "3/2", label: "3:2" },
  { value: "4/3", label: "4:3" },
  { value: "1/1", label: "ריבוע" },
  { value: "4/5", label: "לאורך 4:5" },
  { value: "3/4", label: "לאורך 3:4" },
];

export const COLOR_LABELS: Record<keyof ColorTokens, { label: string; hint: string }> = {
  background: { label: "רקע", hint: "צבע הנייר של האתר" },
  text: { label: "טקסט", hint: "כותרות וטקסט רץ" },
  muted: { label: "טקסט משני", hint: "קטגוריות, תיאורים קטנים" },
  accent: { label: "הדגשה", hint: "הצבע של הכתר: תוויות בעבודות הדיגיטל" },
  border: { label: "קווים", hint: "קווי הפרדה ומסגרות" },
  button: { label: "כפתור", hint: "רקע של כפתורים" },
  buttonText: { label: "טקסט בכפתור", hint: "" },
  hover: { label: "כפתור במעבר עכבר", hint: "" },
};

const base = {
  display: { family: "bebas", weight: 400, size: { desktop: 132, tablet: 88, mobile: 60 }, lineHeight: 0.92, letterSpacing: 0.005, transform: "uppercase", align: "start" },
  heading: { family: "bebas", weight: 400, size: { desktop: 42, tablet: 36, mobile: 30 }, lineHeight: 1, letterSpacing: 0.01, transform: "uppercase", align: "start" },
  title: { family: "heebo", weight: 800, size: { desktop: 150, tablet: 96, mobile: 52 }, lineHeight: 0.95, letterSpacing: -0.03, transform: "none", align: "start" },
  body: { family: "heebo", weight: 400, size: { desktop: 16, tablet: 16, mobile: 16 }, lineHeight: 1.6, letterSpacing: 0, transform: "none", align: "start" },
  caption: { family: "heebo", weight: 400, size: { desktop: 14, tablet: 14, mobile: 13 }, lineHeight: 1.45, letterSpacing: 0, transform: "none", align: "start" },
  hand: { family: "gveret", weight: 400, size: { desktop: 50, tablet: 40, mobile: 34 }, lineHeight: 1.02, letterSpacing: 0, transform: "none", align: "start" },
} satisfies Theme["typography"];

export const PRESETS: Record<PresetId, { label: string; hint: string; theme: Omit<Theme, "preset"> }> = {
  editorial: {
    label: "מגזיני",
    hint: "נייר, דיו וצהוב. ברירת המחדל.",
    theme: {
      grain: true,
      buttons: defaultButtons,
      colors: { background: "#eeece7", text: "#111110", muted: "#6b6862", accent: "#f2c200", border: "#cdc9c1", button: "#111110", buttonText: "#eeece7", hover: "#33322f" },
      typography: base,
    },
  },
  bold: {
    label: "נועז",
    hint: "צהוב חזק, שחור, בלי פשרות.",
    theme: {
      grain: false,
      buttons: { ...defaultButtons, uppercase: true, letterSpacing: 0.06, borderWidth: 2, hover: "invert" },
      colors: { background: "#f2c200", text: "#111110", muted: "#3b3300", accent: "#111110", border: "#111110", button: "#111110", buttonText: "#f2c200", hover: "#33322f" },
      typography: { ...base, title: { ...base.title, family: "secular", weight: 400 } },
    },
  },
  minimal: {
    label: "מינימלי",
    hint: "לבן, שקט, הרבה אוויר.",
    theme: {
      grain: false,
      buttons: { ...defaultButtons, radius: 40, paddingX: 28, weight: 500, hover: "lift", shadow: "soft" },
      colors: { background: "#ffffff", text: "#161616", muted: "#6e6e6e", accent: "#161616", border: "#e4e4e4", button: "#161616", buttonText: "#ffffff", hover: "#3d3d3d" },
      typography: {
        ...base,
        display: { ...base.display, family: "heebo", weight: 800, transform: "none", letterSpacing: -0.03, lineHeight: 1, size: { desktop: 104, tablet: 72, mobile: 46 } },
        heading: { ...base.heading, family: "heebo", weight: 700, transform: "none", letterSpacing: -0.01, size: { desktop: 32, tablet: 28, mobile: 24 } },
      },
    },
  },
  dark: {
    label: "כהה",
    hint: "לילה. העבודות זוהרות.",
    theme: {
      grain: true,
      buttons: { ...defaultButtons, radius: 4 },
      colors: { background: "#121211", text: "#efece6", muted: "#a29e97", accent: "#f2c200", border: "#33322f", button: "#efece6", buttonText: "#121211", hover: "#cfcbc3" },
      typography: base,
    },
  },
};
