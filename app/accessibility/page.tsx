import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageTransition } from "@/components/PageTransition";
import { AboutContact } from "@/components/AboutContact";

export const metadata: Metadata = { title: `הצהרת נגישות — ${site.name}` };

// לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013
// ותקן ישראלי 5568 (מבוסס WCAG 2.0, רמה AA). לעדכן את התאריך בכל שינוי משמעותי באתר.
const UPDATED = "אוקטובר 2026";

export default function AccessibilityPage() {
  return (
    <PageTransition>
      <main id="main" className="wrap statement">
        <h1 className="page-title latin">ACCESSIBILITY</h1>
        <p className="statement-lead">הצהרת נגישות</p>

        <section>
          <h2>מחויבות לנגישות</h2>
          <p>
            חשוב לי שכל אחד ואחת יוכלו לגלוש באתר, לראות את העבודות וליצור קשר, כולל אנשים עם מוגבלות. האתר נבנה
            והונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע״ג-2013, ולתקן הישראלי
            ת״י 5568, המבוסס על הנחיות WCAG 2.0, ברמה AA.
          </p>
        </section>

        <section>
          <h2>מה נעשה באתר</h2>
          <ul>
            <li>מבנה סמנטי עם כותרות, אזורים ותוויות, שמאפשר ניווט נוח בקורא מסך.</li>
            <li>ניווט מלא במקלדת, סימון ברור של הרכיב שבפוקוס, וקישור &quot;דלג לתוכן&quot; בתחילת כל עמוד.</li>
            <li>טקסט חלופי לתמונות.</li>
            <li>תמיכה מלאה בעברית ובכיווניות מימין לשמאל.</li>
            <li>התאמה לטלפונים, לטאבלטים ולמחשבים, ותמיכה בהגדלת תצוגה בדפדפן.</li>
            <li>כיבוד הגדרת &quot;הפחתת תנועה&quot; של מערכת ההפעלה: רוב האנימציות כבויות.</li>
            <li>
              תפריט נגישות (הכפתור בפינת המסך): הגדלת טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים, גופן קריא,
              עצירת אנימציות וסמן עכבר גדול. ההגדרות נשמרות לביקור הבא.
            </li>
          </ul>
        </section>

        <section>
          <h2>מגבלות ידועות</h2>
          <p>
            חלק מהעבודות מוצגות כתמונות שמכילות טקסט (מודעות, שלטים ואריזות), כי זו העבודה עצמה. לכל תמונה כזו יש
            תיאור טקסטואלי. סרטונים שיתווספו לאתר יקבלו כתוביות ככל האפשר. אם נתקלתם ברכיב שאינו נגיש, אשמח לדעת.
          </p>
        </section>

        <section>
          <h2>פניות בנושא נגישות</h2>
          <p>אם נתקלתם בבעיה או שיש לכם הצעה לשיפור, אפשר לפנות אליי ואחזור אליכם בהקדם:</p>
          <dl className="statement-contact">
            <div>
              <dt>רכז נגישות</dt>
              <dd>נתן קוסובסקי</dd>
            </div>
            <div>
              <dt>טלפון</dt>
              <dd>
                <a href={`tel:${site.phoneIntl}`} className="latin">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>מייל</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="latin">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
          <p className="statement-date">ההצהרה עודכנה לאחרונה: {UPDATED}</p>
        </section>
      </main>
      <AboutContact />
    </PageTransition>
  );
}
