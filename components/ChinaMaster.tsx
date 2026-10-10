"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function ChinaMaster({ children }: { children: ReactNode }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const [photoHeight, setPhotoHeight] = useState(0);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = photoRef.current;
    if (!el) return;
    const update = () => setPhotoHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="china-master">
      <div className="china-master-photo" ref={photoRef}>
        <img src="/wuway/master.jpg" alt="Мастер Лю Ляньцзюнь со сборной Martial Store" />
      </div>
      <div className={open ? "china-master-copy is-open" : "china-master-copy"} style={!open && photoHeight ? { height: photoHeight } : undefined}>
        <div>{children}</div>
        <div className={open ? "china-master-fade is-open" : "china-master-fade"}>
          <button type="button" onClick={() => setOpen((value) => !value)}>
            {open ? "Свернуть" : "Развернуть"}
            <span aria-hidden>{open ? "⌃" : "⌄"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
