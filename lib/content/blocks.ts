// סקשנים חופשיים: רכיבים, חלקים ותבניות מוכנות להתחלה.
import type { Block, BlockKind, Cell, CustomSection } from "./types";

type Id = (prefix: string) => string;

export const BLOCK_LABELS: Record<BlockKind, string> = {
  heading: "כותרת",
  text: "טקסט",
  image: "תמונה / וידאו",
  button: "כפתור",
};

export const emptyBlock = (id: string, kind: BlockKind): Block => ({
  id,
  kind,
  text: kind === "heading" ? "כותרת חדשה" : kind === "text" ? "טקסט חדש." : kind === "button" ? "לפרטים" : "",
  href: kind === "button" ? "/#contact" : "",
  media: null,
  ratio: "4/3",
  align: "start",
});

export const emptyCell = (id: string, blocks: Block[] = [], span = 1): Cell => ({ id, span, dir: "stack", valign: "start", blocks });

export const emptySection = (id: string, name = "סקשן חדש"): CustomSection => ({
  id,
  name,
  title: "",
  columns: 2,
  gap: "m",
  tone: "default",
  cells: [],
});

export const SECTION_TEMPLATES: { id: string; label: string; hint: string; build: (id: Id) => CustomSection }[] = [
  {
    id: "side",
    label: "טקסט ותמונה זה לצד זה",
    hint: "2 חלקים: טקסט מימין, תמונה משמאל",
    build: (id) => ({
      ...emptySection(id("s"), "טקסט ותמונה"),
      columns: 2,
      cells: [
        { ...emptyCell(id("cell"), [emptyBlock(id("b"), "heading"), emptyBlock(id("b"), "text")]), valign: "center" },
        emptyCell(id("cell"), [emptyBlock(id("b"), "image")]),
      ],
    }),
  },
  {
    id: "stack",
    label: "טקסט מעל תמונה",
    hint: "חלק אחד ברוחב מלא",
    build: (id) => ({
      ...emptySection(id("s"), "טקסט מעל תמונה"),
      columns: 1,
      cells: [emptyCell(id("cell"), [emptyBlock(id("b"), "heading"), emptyBlock(id("b"), "text"), { ...emptyBlock(id("b"), "image"), ratio: "16/9" }])],
    }),
  },
  {
    id: "quad",
    label: "4 חלקים: 2 ריקים, טקסט ותמונה",
    hint: "4 עמודות. החלקים הריקים נשארים כאוויר",
    build: (id) => ({
      ...emptySection(id("s"), "4 חלקים"),
      columns: 4,
      cells: [emptyCell(id("cell")), emptyCell(id("cell")), { ...emptyCell(id("cell"), [emptyBlock(id("b"), "text")]), valign: "end" }, emptyCell(id("cell"), [emptyBlock(id("b"), "image")])],
    }),
  },
  {
    id: "three",
    label: "3 עמודות טקסט",
    hint: "כותרת וטקסט בכל עמודה",
    build: (id) => ({
      ...emptySection(id("s"), "3 עמודות"),
      columns: 3,
      cells: [1, 2, 3].map(() => emptyCell(id("cell"), [emptyBlock(id("b"), "heading"), emptyBlock(id("b"), "text")])),
    }),
  },
  {
    id: "blank",
    label: "ריק",
    hint: "חלק אחד ריק, בונים מאפס",
    build: (id) => ({ ...emptySection(id("s")), columns: 1, cells: [emptyCell(id("cell"))] }),
  },
];

/** מפתח הסקשן ברשימת האזורים */
export const sectionKey = (id: string) => `c:${id}` as const;
/** העוגן שלו בדף */
export const sectionAnchor = (id: string) => `s-${id}`;
