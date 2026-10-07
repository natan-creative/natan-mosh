// מסך פתיחה קצר. מוצג רק כש-html מקבל class="intro" (פעם בסשן, לא כשמבקשים פחות תנועה).
// כולו CSS: גם אם JS נכשל, הוא נעלם לבד.
export function Loader({ name }: { name: string }) {
  return (
    <div className="loader" aria-hidden="true">
      <span className="loader-name latin">{name.toUpperCase()}</span>
      <span className="loader-count latin">
        0
        <span className="loader-digits">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </span>{" "}
        / 04
      </span>
    </div>
  );
}
