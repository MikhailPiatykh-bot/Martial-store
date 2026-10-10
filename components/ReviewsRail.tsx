"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactNode } from "react";

const AUTO_SPEED = 24;
const ARROW_SPEED = 900;

function mod(value: number, loop: number) {
  if (loop <= 0) return 0;
  return ((value % loop) + loop) % loop;
}

export function ReviewsRail({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const nudge = useRef<number | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const loop = loopWidth(el);
      if (nudge.current !== null) {
        const delta = nudge.current - offset.current;
        const max = ARROW_SPEED * dt;
        if (Math.abs(delta) <= max) {
          offset.current = nudge.current;
          nudge.current = null;
        } else {
          offset.current += Math.sign(delta) * max;
        }
      } else if (!media.matches && document.visibilityState === "visible") {
        offset.current += AUTO_SPEED * dt;
      }
      if (loop > 0 && nudge.current === null) offset.current = mod(offset.current, loop);
      el.scrollLeft = mod(offset.current, loop);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function scroll(direction: number) {
    const el = track.current;
    if (!el) return;
    const step = cardStep(el);
    const current = nudge.current ?? offset.current;
    nudge.current = current + direction * step;
  }

  const items = Children.toArray(children);

  return (
    <div className="china-rail arrows-sides">
      <div className="china-rail-frame">
        <div className="china-rail-arrows">
          <button type="button" aria-label="Предыдущее" onClick={() => scroll(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Следующее" onClick={() => scroll(1)}>
            ›
          </button>
        </div>
        <div className="china-rail-track" ref={track}>
          {items}
          {items.map((item, index) =>
            isValidElement(item) ? (
              cloneElement(item, { key: `loop-${index}`, "aria-hidden": true } as { key: string })
            ) : (
              item
            ),
          )}
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
  if (cards.length < 2) return el.clientWidth * 0.8;
  return cards[1].offsetLeft - cards[0].offsetLeft;
}
