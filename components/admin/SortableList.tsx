"use client";

import { useState } from "react";

/** הזזת פריט ממקום למקום (מחזיר מערך חדש) */
export function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type Props<T> = {
  items: T[];
  getId: (item: T) => string;
  label: (item: T) => string;
  onMove: (from: number, to: number) => void;
  render: (item: T, index: number) => React.ReactNode;
};

/** רשימה שאפשר לסדר: גרירה בעכבר, או כפתורי למעלה/למטה (מקלדת ומובייל) */
export function SortableList<T>({ items, getId, label, onMove, render }: Props<T>) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  return (
    <ol className="ad-sortable">
      {items.map((item, i) => (
        <li
          key={getId(item)}
          className="ad-sortable-item"
          data-dragging={dragging === i || undefined}
          data-over={over === i && dragging !== null && dragging !== i ? (dragging < i ? "after" : "before") : undefined}
          onDragOver={(e) => {
            if (dragging === null) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setOver(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging !== null && dragging !== i) onMove(dragging, i);
            setDragging(null);
            setOver(null);
          }}
        >
          <div className="ad-sort-handle-col">
            <span
              className="ad-drag"
              draggable
              title="גרירה לשינוי הסדר"
              aria-hidden="true"
              onDragStart={(e) => {
                setDragging(i);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", getId(item));
                const row = (e.currentTarget as HTMLElement).closest("li");
                if (row) e.dataTransfer.setDragImage(row, 20, 20);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
            >
              ⠿
            </span>
            <div className="ad-move">
              <button type="button" aria-label={`הזזה למעלה: ${label(item)}`} disabled={i === 0} onClick={() => onMove(i, i - 1)}>
                ↑
              </button>
              <button type="button" aria-label={`הזזה למטה: ${label(item)}`} disabled={i === items.length - 1} onClick={() => onMove(i, i + 1)}>
                ↓
              </button>
            </div>
          </div>
          <div className="ad-sortable-body">{render(item, i)}</div>
        </li>
      ))}
    </ol>
  );
}
