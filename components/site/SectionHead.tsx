import Link from "next/link";

type Props = {
  title: string;
  action?: { href: string; label: string } | React.ReactNode;
  el?: { "data-el": string; style: React.CSSProperties };
};

export function SectionHead({ title, action, el }: Props) {
  const link =
    action && typeof action === "object" && "href" in action ? (action as { href: string; label: string }) : null;
  return (
    <div className="section-head" data-reveal="slide" {...el}>
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
