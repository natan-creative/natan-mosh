// מבנה התוכן של האתר: מסמך אחד מובנה. העיצוב קבוע, התוכן והפרמטרים הוויזואליים כאן.
// כל שדה חדש צריך ערך ב-defaults.ts, ו-normalize.ts משלים אותו למסמכים ישנים.

export type MediaKind = "image" | "video" | "embed";
export type Fit = "cover" | "contain" | "original";
export type Ratio = `${number}/${number}`;

/** הפניה לקובץ מדיה + איך להציג אותו במקום הספציפי הזה */
export type MediaRef = {
  /** מזהה בספריית המדיה. "static:/work/x.webp" לקבצים שמגיעים עם האתר, "embed:<url>" לסרטון מ-YouTube/Vimeo */
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** נקודת פוקוס באחוזים (0–100) */
  focal?: { x: number; y: number };
  /** זום (1–2): יחד עם נקודת הפוקוס זה ה"חיתוך" */
  zoom?: number;
  fit?: Fit;
  // וידאו
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

export type GalleryItem = {
  id: string;
  media: MediaRef;
  ratio: Ratio;
  span: "full" | "half";
};

export type Project = {
  id: string;
  slug: string;
  hidden: boolean;
  type: "case" | "idea";
  title: string;
  subtitle: string;
  /** מה שמופיע מתחת לכרטיס: קמפיין / קונספט */
  kind: string;
  /** תגית באנגלית בעמוד העבודה: Campaign / Idea */
  category: string;
  client: string;
  year: string;
  role: string;
  summary: string;
  brief: string;
  challenge: string;
  idea: string;
  ideaMore: string;
  /** התובנה (לא חובה) */
  insight: string;
  execution: string;
  /** החלק שלי בעבודה */
  myPart: string;
  result: string;
  stats: string[];
  credits: string;
  links: { id: string; label: string; href: string }[];
  /** לוגו הלקוח / הפרויקט */
  logo: MediaRef | null;
  cover: MediaRef | null;
  gallery: GalleryItem[];
  design: {
    accent: string;
    heroRatio: Ratio;
    align: "start" | "center";
  };
};

export type DigitalItem = {
  id: string;
  hidden: boolean;
  title: string;
  client: string;
  category: string;
  year: string;
  problem: string;
  idea: string;
  execution: string;
  link: string;
  media: MediaRef | null;
};

export type NameStyle = "black" | "heavy" | "serif" | "spaced" | "wide";

export type NameItem = {
  id: string;
  hidden: boolean;
  name: string;
  style: NameStyle;
  description: string;
  note: string;
  client: string;
  year: string;
  image: MediaRef | null;
};

export type NavItem = { id: string; label: string; href: string };

export type SectionId = "work" | "digital" | "naming" | "about" | "contact";

export type FontId = "bebas" | "heebo" | "rubik" | "frank" | "secular" | "gveret";

export type Sizes = { desktop: number; tablet: number; mobile: number };

export type TypeStyle = {
  family: FontId;
  weight: number;
  size: Sizes;
  lineHeight: number;
  letterSpacing: number; // em
  transform: "none" | "uppercase";
  align: "start" | "center" | "end";
};

export type TypeRole = "display" | "heading" | "title" | "body" | "caption" | "hand";

export type ColorTokens = {
  background: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  button: string;
  buttonText: string;
  hover: string;
};

export type PresetId = "editorial" | "bold" | "minimal" | "dark";

export type Theme = {
  preset: PresetId | "custom";
  colors: ColorTokens;
  grain: boolean;
  typography: Record<TypeRole, TypeStyle>;
};

export type Motion = {
  enabled: boolean;
  intensity: "subtle" | "default" | "expressive";
  pageTransitions: boolean;
  hover: boolean;
  loader: boolean;
};

export type SiteContent = {
  version: 1;
  settings: {
    siteTitle: string;
    metaDescription: string;
    canonical: string;
    gaId: string;
    ogImage: MediaRef | null;
    favicon: MediaRef | null;
  };
  brand: { name: string; short: string; role: string };
  header: { sticky: boolean; nav: NavItem[]; background: string; text: string };
  hero: {
    headline: string;
    note: string;
    showRole: boolean;
    cta: { label: string; href: string };
    image: MediaRef | null;
    video: MediaRef | null;
  };
  sections: { id: SectionId; visible: boolean }[];
  work: { title: string; linkLabel: string; columns: number; cardRatio: Ratio; projects: Project[] };
  digital: {
    title: string;
    /** משפט-שניים מתחת לכותרת (לא חובה) */
    intro: string;
    linkLabel: string;
    homeLimit: number;
    columns: { desktop: number; tablet: number; mobile: number };
    items: DigitalItem[];
  };
  naming: { title: string; visibleCount: number; items: NameItem[] };
  about: { title: string; body: string; quote: string; image: MediaRef | null };
  contact: {
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    instagram: string;
    cta: string;
    whatsapp: { enabled: boolean; number: string; message: string };
  };
  footer: {
    copyright: string;
    wink: { idle: string; reveal: string };
    nav: NavItem[];
    notFound: string;
  };
  theme: Theme;
  motion: Motion;
};

/** פריט בספריית המדיה */
export type MediaAsset = {
  id: string;
  kind: Exclude<MediaKind, "embed">;
  src: string;
  name: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alt: string;
  caption: string;
  createdAt: string;
  /** קבצים שמגיעים עם האתר (public/work) – אי אפשר למחוק */
  builtIn?: boolean;
};

export type Revision = {
  id: string;
  createdAt: string;
  kind: "publish" | "draft" | "restore";
  label: string;
};
