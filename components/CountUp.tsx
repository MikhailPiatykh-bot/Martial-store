"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ to }: { to: number }) {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let started = false;
    let sawHidden = false;

    const finish = () => {
      if (started) return;
      started = true;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setValue(to);
        return;
      }
      setValue(0);
      const start = performance.now();
      const duration = 1800;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(eased * to));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) {
          sawHidden = true;
          return;
        }
        if (sawHidden) finish();
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {new Intl.NumberFormat("ru-RU").format(value)}
    </span>
  );
}
