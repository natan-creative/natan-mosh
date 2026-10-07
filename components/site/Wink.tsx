"use client";

import { useState } from "react";

// קריצה: טקסט קטן שמתחלף ב-hover / focus / tap.
export function Wink({ idle, reveal }: { idle: string; reveal: string }) {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="wink" data-on={on || undefined} onClick={() => setOn((v) => !v)} aria-label={`${idle} ${reveal}`}>
      <span className="wink-idle" aria-hidden="true">{idle}</span>
      <span className="wink-reveal" aria-hidden="true">{reveal}</span>
    </button>
  );
}
