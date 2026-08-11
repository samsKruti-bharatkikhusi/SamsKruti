import { Fragment } from "react";

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-strip ${className}`.trim()} aria-hidden="true">
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <Fragment key={i}>
            <span>{item}</span>
            <span className="marquee-sep">◆</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
