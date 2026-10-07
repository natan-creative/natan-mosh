import Link from "next/link";

type Props = {
  title: string;
  action?: { href: string; label: string } | React.ReactNode;
};

export function SectionHead({ title, action }: Props) {
  const link =
    action && typeof action === "object" && "href" in action ? (action as { href: string; label: string }) : null;
  return (
    <div className="section-head" data-reveal="slide">
      <h2 className="section-title latin">{title}</h2>
      {link ? (
        <Link href={link.href} className="section-action" transitionTypes={["nav-forward"]}>
          {link.label} <span aria-hidden="true">←</span>
        </Link>
      ) : (
        (action as React.ReactNode)
      )}
    </div>
  );
}
