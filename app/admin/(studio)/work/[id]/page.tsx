"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { RATIOS } from "@/lib/content/limits";
import { refFromAsset } from "@/lib/content/media-usage";
import type { Project } from "@/lib/content/types";
import { MediaField } from "@/components/admin/MediaField";
import { MediaLibrary, Thumb } from "@/components/admin/MediaLibrary";
import { move, SortableList } from "@/components/admin/SortableList";
import { ItemActions, LinkInput, newId } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, ColorInput, Modal, PageHeader, Segmented, Select, Tabs, TextArea, TextInput } from "@/components/admin/ui";

type Tab = "content" | "media" | "design";

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const { content: c, update } = useStudio();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [picking, setPicking] = useState(false);
  const index = c.work.projects.findIndex((p) => p.id === id);
  const p = c.work.projects[index];
  usePreviewPath(p && !p.hidden ? `/work/${p.slug}` : "/#work");
  if (!p) {
    return (
      <>
        <PageHeader title="העבודה לא נמצאה" intro="ייתכן שהיא נמחקה." />
        <Link href="/admin/work" className="ad-btn ad-btn-secondary">
          חזרה ל-Selected Work
        </Link>
      </>
    );
  }
  const remove = () => {
    router.push("/admin/work");
    update((d) => void (d.work.projects = d.work.projects.filter((x) => x.id !== id)));
  };

  const set = <K extends keyof Project>(k: K, v: Project[K]) =>
    update((d) => {
      const x = d.work.projects.find((x) => x.id === id);
      if (x) x[k] = v;
    }, `p.${id}.${String(k)}`);
  const text = (k: "title" | "subtitle" | "kind" | "category" | "client" | "year" | "role" | "summary" | "brief" | "challenge" | "idea" | "ideaMore" | "execution" | "result" | "credits") => (v: string) => set(k, v);
  const isCase = p.type === "case";

  return (
    <>
      <p className="ad-crumb">
        <Link href="/admin/work">→ Selected Work</Link>
      </p>
      <PageHeader
        title={p.title || "עבודה חדשה"}
        intro={p.hidden ? "העבודה מוסתרת באתר." : undefined}
        actions={<ItemActions kind="עבודה" name={p.title} hidden={p.hidden} onToggle={() => set("hidden", !p.hidden)} onDelete={remove} />}
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "content", label: "תוכן" },
          { id: "media", label: "מדיה" },
          { id: "design", label: "עיצוב" },
        ]}
      />

      {tab === "content" && (
        <>
          <Card title="בסיס">
            <Segmented
              label="סוג העבודה"
              hint="Case Study מקבל עמוד מלא: בריף, אתגר, רעיון, ביצוע ותוצאה. רעיון קצר מקבל עמוד קצר."
              value={p.type}
              onChange={(v) => set("type", v)}
              options={[
                { value: "case", label: "Case Study" },
                { value: "idea", label: "רעיון קצר" },
              ]}
            />
            <TextInput label="כותרת" value={p.title} onChange={text("title")} />
            <TextInput label="תת-כותרת" value={p.subtitle} onChange={text("subtitle")} />
            <div className="ad-cols">
              <TextInput label="מתחת לכרטיס" hint="למשל: קמפיין, קונספט" value={p.kind} onChange={text("kind")} />
              <TextInput label="קטגוריה (באנגלית)" hint="Campaign / Idea / Branding" dir="ltr" value={p.category} onChange={text("category")} />
            </div>
            <div className="ad-cols">
              <TextInput label="לקוח" value={p.client} onChange={text("client")} />
              <TextInput label="שנה" value={p.year} onChange={text("year")} />
              <TextInput label="תפקיד" value={p.role} onChange={text("role")} />
            </div>
            <TextArea label="תיאור קצר" hint="משפט-שניים. מופיע בשיתוף ברשתות, ובעמוד של רעיון קצר." value={p.summary} onChange={text("summary")} />
          </Card>
          {isCase ? (
            <Card title="הסיפור" hint="כל חלק שנשאר ריק פשוט לא יופיע.">
              <TextArea label="The Brief: מה ביקשו?" value={p.brief} onChange={text("brief")} />
              <TextArea label="The Challenge: מה באמת היה צריך לפתור?" value={p.challenge} onChange={text("challenge")} />
              <TextArea label="The Idea: הרעיון במשפט אחד" value={p.idea} onChange={text("idea")} />
              <TextArea label="הרחבה על הרעיון" value={p.ideaMore} onChange={text("ideaMore")} />
              <TextArea label="The Execution: איך זה יצא לעולם" value={p.execution} onChange={text("execution")} />
              <TextArea label="The Result: מה יצא מזה" value={p.result} onChange={text("result")} />
              <TextArea label="מספרים" hint="מספר אחד בכל שורה (למשל: 2.4M צפיות)" rows={3} value={p.stats.join("\n")} onChange={(v) => set("stats", v.split("\n"))} />
            </Card>
          ) : (
            <Card title="הרעיון">
              <TextArea label="הרעיון במשפט אחד" value={p.idea} onChange={text("idea")} />
            </Card>
          )}
          <Card title="נוסף">
            <TextArea label="קרדיטים" hint="שורה לכל אחד" value={p.credits} onChange={text("credits")} />
            <LinkInput label="קישור חיצוני" hint="לסרט, לכתבה, לאתר הקמפיין" value={p.link} onChange={(v) => set("link", v)} />
            <TextInput label="כתובת העמוד" hint={`האתר/work/${p.slug} · אותיות באנגלית, מספרים ומקפים`} dir="ltr" value={p.slug} onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          </Card>
        </>
      )}

      {tab === "media" && (
        <>
          <Card title="תמונה ראשית" hint="מופיעה בכרטיס ובראש עמוד העבודה. אפשר גם סרטון.">
            <MediaField label="מדיה ראשית" ratio="3/4" value={p.cover} onChange={(m) => set("cover", m)} />
          </Card>
          <Card
            title="גלריה"
            hint="תמונות וסרטונים שמופיעים בעמוד העבודה. גרור לשינוי סדר."
            actions={<Button onClick={() => setPicking(true)}>+ הוספה</Button>}
          >
            {p.gallery.length === 0 ? (
              <p className="ad-hint">עדיין אין כאן כלום.</p>
            ) : (
              <SortableList
                items={p.gallery}
                getId={(g) => g.id}
                label={(g) => g.media.alt || "פריט"}
                onMove={(a, b) => update((d) => {
                  const x = d.work.projects.find((x) => x.id === id)!;
                  x.gallery = move(x.gallery, a, b);
                })}
                render={(g, gi) => {
                  const patch = (fn: (g: Project["gallery"][number]) => void) =>
                    update((d) => fn(d.work.projects.find((x) => x.id === id)!.gallery[gi]), `g.${g.id}`);
                  return (
                    <div className="ad-gallery-item">
                      <MediaField label={`פריט ${gi + 1}`} ratio={g.ratio} value={g.media} onChange={(m) => (m ? patch((x) => void (x.media = m)) : update((d) => {
                        const x = d.work.projects.find((x) => x.id === id)!;
                        x.gallery = x.gallery.filter((y) => y.id !== g.id);
                      }))} />
                      <div className="ad-cols">
                        <Select label="יחס" value={g.ratio} onChange={(v) => patch((x) => void (x.ratio = v))} options={RATIOS} />
                        <Segmented label="רוחב" value={g.span} onChange={(v) => patch((x) => void (x.span = v))} options={[{ value: "full", label: "מלא" }, { value: "half", label: "חצי" }]} />
                      </div>
                      <ItemActions kind="פריט" name={`פריט ${gi + 1}`} onDelete={() => update((d) => {
                        const x = d.work.projects.find((x) => x.id === id)!;
                        x.gallery = x.gallery.filter((y) => y.id !== g.id);
                      })} />
                    </div>
                  );
                }}
              />
            )}
          </Card>
          <Modal open={picking} onClose={() => setPicking(false)} title="הוספה לגלריה" wide>
            <MediaLibrary
              onSelect={(a) => {
                update((d) => void d.work.projects.find((x) => x.id === id)!.gallery.push({ id: newId("g"), media: refFromAsset(a), ratio: "16/9", span: "full" }));
                setPicking(false);
              }}
            />
          </Modal>
        </>
      )}

      {tab === "design" && (
        <Card title="עיצוב העבודה">
          <ColorInput label="צבע הדגשה" hint="הקו מתחת לכותרת ב-hover, והסימנים בעמוד העבודה" value={p.design.accent} onChange={(v) => update((d) => void (d.work.projects[index].design.accent = v), `p.${id}.accent`)} />
          <Select label="יחס התמונה בראש העמוד" value={p.design.heroRatio} onChange={(v) => update((d) => void (d.work.projects[index].design.heroRatio = v))} options={RATIOS} />
          <Segmented label="יישור הכותרת" value={p.design.align} onChange={(v) => update((d) => void (d.work.projects[index].design.align = v))} options={[{ value: "start", label: "לימין" }, { value: "center", label: "למרכז" }]} />
          {p.cover && (
            <div className="ad-field">
              <span className="ad-label">כך הכרטיס נראה</span>
              <div className="ad-card-preview">
                <Thumb asset={{ kind: p.cover.kind, src: p.cover.src, name: "" }} style={{ objectPosition: `${p.cover.focal?.x ?? 50}% ${p.cover.focal?.y ?? 50}%` }} />
              </div>
              <p className="ad-hint">לשינוי החיתוך: מדיה ← פוקוס, חיתוך ותיאור.</p>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
