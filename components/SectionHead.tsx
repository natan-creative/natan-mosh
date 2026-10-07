export function SectionHead({ index, title, children }: { index: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="section-head" data-reveal="slide">
      <h2 className="label latin">
        <span className="section-index">({index})</span> {title}
      </h2>
      {children}
    </div>
  );
}
