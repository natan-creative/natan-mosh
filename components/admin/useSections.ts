"use client";

import { useRouter } from "next/navigation";
import { SECTION_TEMPLATES, sectionKey } from "@/lib/content/blocks";
import type { CustomSection } from "@/lib/content/types";
import { newId } from "./fields";
import { useStudio } from "./StudioContext";

/** הוספה, שכפול ומחיקה של סקשנים חופשיים (גם ברשימת האזורים בדף הבית) */
export function useSections() {
  const { update } = useStudio();
  const router = useRouter();

  const insert = (s: CustomSection, after?: string) =>
    update((d) => {
      d.custom.push(s);
      const key = sectionKey(s.id);
      // אחרי הסקשן שמשכפלים, או לפני אודות / יצירת קשר
      const at = after ? d.sections.findIndex((x) => x.id === sectionKey(after)) + 1 : d.sections.findIndex((x) => x.id === "about" || x.id === "contact");
      d.sections.splice(at > 0 ? at : d.sections.length, 0, { id: key, visible: true });
    });

  return {
    add(templateId: string) {
      const t = SECTION_TEMPLATES.find((x) => x.id === templateId) ?? SECTION_TEMPLATES[0];
      const s = t.build(newId);
      insert(s);
      router.push(`/admin/sections/${s.id}`);
    },
    duplicate(s: CustomSection) {
      const copy: CustomSection = {
        ...structuredClone(s),
        id: newId("s"),
        name: `${s.name} (עותק)`,
        cells: s.cells.map((c) => ({ ...structuredClone(c), id: newId("cell"), blocks: c.blocks.map((b) => ({ ...structuredClone(b), id: newId("b") })) })),
      };
      insert(copy, s.id);
      return copy.id;
    },
    remove(id: string) {
      update((d) => {
        d.custom = d.custom.filter((x) => x.id !== id);
        d.sections = d.sections.filter((x) => x.id !== sectionKey(id));
      });
    },
  };
}
