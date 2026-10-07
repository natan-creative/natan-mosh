"use client";

import type { NavItem } from "@/lib/content/types";
import { move, SortableList } from "./SortableList";
import { ItemActions, LinkInput, newId } from "./fields";
import { Button, TextInput } from "./ui";

export function NavEditor({ items, onChange, keyPrefix }: { items: NavItem[]; onChange: (items: NavItem[], key?: string) => void; keyPrefix: string }) {
  return (
    <>
      <SortableList
        items={items}
        getId={(n) => n.id}
        label={(n) => n.label}
        onMove={(a, b) => onChange(move(items, a, b))}
        render={(n, i) => (
          <div className="ad-nav-item">
            <div className="ad-cols">
              <TextInput label="טקסט" value={n.label} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, label: v } : x)), `${keyPrefix}.${n.id}.label`)} />
              <LinkInput label="קישור" value={n.href} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, href: v } : x)), `${keyPrefix}.${n.id}.href`)} />
            </div>
            <ItemActions kind="קישור" name={n.label} onDelete={() => onChange(items.filter((x) => x.id !== n.id))} />
          </div>
        )}
      />
      <Button onClick={() => onChange([...items, { id: newId("n"), label: "קישור חדש", href: "/" }])}>+ הוסף קישור</Button>
    </>
  );
}
