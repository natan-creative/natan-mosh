import { ViewTransition } from "react";

// מעבר בין עמודים: התוכן יוצא מהר ונכנס בעדינות. התמונה עצמה עושה morph בנפרד.
const types = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={types} exit={types} default="none">
      {children}
    </ViewTransition>
  );
}
