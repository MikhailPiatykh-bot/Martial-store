"use client";

import { Children, cloneElement, isValidElement, useRef, type ReactNode } from "react";

export function ChinaRail({
  title,
  arrows = "header",
  children,
}: {
  title?: string;
  arrows?: "header" | "sides";
  children: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const token = useRef(0);

  function scroll(direction: number) {
    const el = track.current;
    if (!el) return;
    const loop = loopWidth(el);
    const step = cardStep(el);
    if (loop <= 0 || step <= 0) return;

    const current = ++token.current;
    let from = el.scrollLeft % loop;
    if (el.scrollLeft >= loop) el.scrollLeft = from;
    if (direction < 0 && from < 1) {
      el.scrollLeft = loop;
      from = loop;
    }
    const to = from + direction * step;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.scrollLeft = to >= loop ? to % loop : to;
      return;
    }

    const started = performance.now();
    const tick = (now: number) => {
      if (current !== token.current || !track.current) return;
      const progress = Math.min(1, (now - started) / 420);
      const eased = 1 - (1 - progress) ** 3;
      let pos = from + (to - from) * eased;
      if (pos >= loop && (progress === 1 || pos > loop)) pos -= loop;
      track.current.scrollLeft = pos;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const items = Children.toArray(children);
  const clones = items.map((item, index) =>
    isValidElement(item)
      ? cloneElement(item, { key: `loop-${index}`, "aria-hidden": true, tabIndex: -1 } as { key: string })
      : item,
  );

  const controls = (
    <div className="china-rail-arrows">
      <button type="button" aria-label="Предыдущее" onClick={() => scroll(-1)}>
        ‹
      </button>
      <button type="button" aria-label="Следующее" onClick={() => scroll(1)}>
        ›
      </button>
    </div>
  );

  return (
    <div className={`china-rail arrows-${arrows}`}>
      {title ? (
        <div className="china-rail-head">
          <h2>{title}</h2>
          {arrows === "header" ? controls : null}
        </div>
      ) : null}
      <div className="china-rail-frame">
        {arrows === "sides" ? controls : null}
        <div className="china-rail-track is-loop" ref={track}>
          {items}
          {clones}
        </div>
      </div>
    </div>
  );
}

function loopWidth(el: HTMLElement) {
  const cards = [...el.children] as HTMLElement[];
  if (cards.length < 2) return 0;
  const half = cards.length / 2;
  return cards[half].offsetLeft - cards[0].offsetLeft;
}

function cardStep(el: HTMLElement) {
  const cards = [...el.children] as HTMLElement[];
  if (cards.length < 2) return el.clientWidth;
  return cards[1].offsetLeft - cards[0].offsetLeft;
}
