"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { contrastRatio, HEX } from "@/lib/content/contrast";

// ---------- Layout ----------

export function PageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: React.ReactNode }) {
  return (
    <header className="ad-page-head">
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {actions && <div className="ad-page-actions">{actions}</div>}
    </header>
  );
}

export function Card({ title, hint, children, actions }: { title?: string; hint?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="ad-card">
      {(title || actions) && (
        <div className="ad-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {hint && <p className="ad-hint">{hint}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="ad-card-body">{children}</div>
    </section>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: { id: T; label: string }[] }) {
  return (
    <div className="ad-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={value === t.id} className="ad-tab" onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="ad-empty">
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button type="button" className={`ad-btn ad-btn-${variant} ${className}`} {...props} />;
}

// ---------- Fields ----------

type FieldProps = { label: string; hint?: string; warning?: string | null; children: (id: string, describedBy?: string) => React.ReactNode; wide?: boolean };

export function Field({ label, hint, warning, children, wide }: FieldProps) {
  const id = useId();
  const hintId = hint || warning ? `${id}-hint` : undefined;
  return (
    <div className={`ad-field${wide ? " is-wide" : ""}`}>
      <label htmlFor={id} className="ad-label">
        {label}
      </label>
      {children(id, hintId)}
      {(hint || warning) && (
        <p id={hintId} className={warning ? "ad-warning" : "ad-hint"} role={warning ? "status" : undefined}>
          {warning ?? hint}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  dir,
  placeholder,
  type = "text",
  list,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl" | "auto";
  placeholder?: string;
  type?: string;
  list?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id, d) => (
        <input id={id} aria-describedby={d} className="ad-input" type={type} value={value} dir={dir ?? "auto"} placeholder={placeholder} list={list} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 3, dir }: { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; dir?: "ltr" | "rtl" | "auto" }) {
  return (
    <Field label={label} hint={hint} wide>
      {(id, d) => <textarea id={id} aria-describedby={d} className="ad-input ad-textarea" rows={rows} dir={dir ?? "auto"} value={value} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

/** מספר עם גבולות: אי אפשר לצאת מהטווח */
export function NumberInput({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  const [text, setText] = useState(String(value));
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setText(String(value));
  }
  const decimals = (String(step).split(".")[1] ?? "").length;
  const clamp = (n: number) => Number(Math.min(max, Math.max(min, n)).toFixed(decimals));
  const commit = (raw: string) => {
    const n = parseFloat(raw);
    const v = Number.isFinite(n) ? clamp(n) : value;
    setText(String(v));
    if (v !== value) onChange(v);
  };
  return (
    <Field label={label} hint={hint ?? `${min}–${max}${unit ? ` ${unit}` : ""}`}>
      {(id, d) => (
        <div className="ad-number">
          <button type="button" className="ad-step" aria-label={`הפחתה: ${label}`} onClick={() => onChange(clamp(value - step))} disabled={value <= min}>
            −
          </button>
          <input
            id={id}
            aria-describedby={d}
            className="ad-input"
            inputMode="decimal"
            dir="ltr"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const n = parseFloat(e.target.value);
              if (Number.isFinite(n) && n >= min && n <= max) onChange(Number(n.toFixed(decimals)));
            }}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
              if (e.key === "ArrowUp") {
                e.preventDefault();
                onChange(clamp(value + step));
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                onChange(clamp(value - step));
              }
            }}
          />
          {unit && <span className="ad-unit">{unit}</span>}
          <button type="button" className="ad-step" aria-label={`הוספה: ${label}`} onClick={() => onChange(clamp(value + step))} disabled={value >= max}>
            +
          </button>
        </div>
      )}
    </Field>
  );
}

export function Slider({ label, hint, value, onChange, min, max, step, format }: { label: string; hint?: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format?: (v: number) => string }) {
  return (
    <Field label={label} hint={hint}>
      {(id, d) => (
        <div className="ad-slider">
          <input id={id} aria-describedby={d} type="range" dir="ltr" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-valuetext={format?.(value)} />
          <output htmlFor={id} dir="ltr">
            {format ? format(value) : value}
          </output>
        </div>
      )}
    </Field>
  );
}

export function Select<T extends string | number>({ label, hint, value, onChange, options }: { label: string; hint?: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <Field label={label} hint={hint}>
      {(id, d) => (
        <select
          id={id}
          aria-describedby={d}
          className="ad-input ad-select"
          value={String(value)}
          onChange={(e) => {
            const o = options.find((x) => String(x.value) === e.target.value);
            if (o) onChange(o.value);
          }}
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** בחירה אחת מתוך כמה (כפתורים) */
export function Segmented<T extends string | number>({ label, hint, value, onChange, options }: { label: string; hint?: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  const id = useId();
  return (
    <div className="ad-field">
      <span className="ad-label" id={id}>
        {label}
      </span>
      <div className="ad-segmented" role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="ad-hint">{hint}</p>}
    </div>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="ad-toggle-row">
      <div>
        <span className="ad-label" id={id}>
          {label}
        </span>
        {hint && <p className="ad-hint">{hint}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={id} className="ad-switch" onClick={() => onChange(!checked)}>
        <span aria-hidden="true" />
        <span className="ad-switch-text">{checked ? "פעיל" : "כבוי"}</span>
      </button>
    </div>
  );
}

/** צבע: picker + hex. מתריע על ניגודיות נמוכה מול צבע אחר */
export function ColorInput({ label, hint, value, onChange, against, againstLabel, allowEmpty, min = 4.5 }: { label: string; hint?: string; value: string; onChange: (v: string) => void; against?: string; againstLabel?: string; allowEmpty?: boolean; min?: number }) {
  const [text, setText] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setText(value);
  }
  const ratio = against && HEX.test(value) ? contrastRatio(value, against) : null;
  const warning = ratio !== null && ratio < min ? `ייתכן שניגודיות הצבעים נמוכה מדי (${ratio.toFixed(1)}:1 מול ${againstLabel ?? "הרקע"}, מומלץ לפחות ${min}:1).` : null;
  return (
    <Field label={label} hint={hint} warning={warning}>
      {(id, d) => (
        <div className="ad-color">
          <input type="color" aria-label={`בחירת צבע: ${label}`} value={HEX.test(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)} />
          <input
            id={id}
            aria-describedby={d}
            className="ad-input"
            dir="ltr"
            value={text}
            placeholder={allowEmpty ? "ברירת מחדל" : "#111111"}
            onChange={(e) => {
              const v = e.target.value.trim();
              setText(v);
              if (HEX.test(v) || (allowEmpty && v === "")) onChange(v.toLowerCase());
            }}
            onBlur={() => setText(value)}
          />
          {allowEmpty && value && (
            <button type="button" className="ad-btn ad-btn-ghost" onClick={() => onChange("")}>
              איפוס
            </button>
          )}
        </div>
      )}
    </Field>
  );
}

// ---------- Confirm dialog ----------

type ConfirmOpts = { title: string; body?: React.ReactNode; confirm: string; danger?: boolean };
const ConfirmCtx = createContext<(o: ConfirmOpts) => Promise<boolean>>(async () => false);

export function useConfirm() {
  return useContext(ConfirmCtx);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [opts, setOpts] = useState<ConfirmOpts | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback((o: ConfirmOpts) => {
    setOpts(o);
    return new Promise<boolean>((res) => {
      resolver.current = res;
    });
  }, []);

  useEffect(() => {
    if (opts && ref.current && !ref.current.open) ref.current.showModal();
  }, [opts]);

  const close = (v: boolean) => {
    ref.current?.close();
    setOpts(null);
    resolver.current(v);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <dialog ref={ref} className="ad-dialog" aria-labelledby="ad-confirm-title" onCancel={(e) => (e.preventDefault(), close(false))}>
        {opts && (
          <>
            <h2 id="ad-confirm-title">{opts.title}</h2>
            {opts.body && <div className="ad-dialog-body">{opts.body}</div>}
            <div className="ad-dialog-actions">
              <Button onClick={() => close(false)} autoFocus>
                ביטול
              </Button>
              <Button variant={opts.danger ? "danger" : "primary"} onClick={() => close(true)}>
                {opts.confirm}
              </Button>
            </div>
          </>
        )}
      </dialog>
    </ConfirmCtx.Provider>
  );
}

// ---------- Modal ----------

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`ad-dialog ad-modal${wide ? " is-wide" : ""}`} aria-label={title} onCancel={(e) => (e.preventDefault(), onClose())}>
      <div className="ad-modal-head">
        <h2>{title}</h2>
        <Button variant="ghost" onClick={onClose}>
          סגירה
        </Button>
      </div>
      {open && children}
    </dialog>
  );
}
