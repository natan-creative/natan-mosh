import type { Metadata } from "next";
import { getPublishedContent } from "@/lib/store";
import { AccessibilityView } from "@/components/site/views";

export const metadata: Metadata = { title: "הצהרת נגישות" };

// לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013
// ותקן ישראלי 5568 (מבוסס WCAG 2.0, רמה AA). לעדכן את התאריך בכל שינוי משמעותי באתר.
const ACCESSIBILITY_UPDATED = "אוקטובר 2026";

export default async function AccessibilityPage() {
  return <AccessibilityView c={await getPublishedContent()} updated={ACCESSIBILITY_UPDATED} />;
}
