"use client";

import { useEffect, useState } from "react";
import { ChinaRail } from "@/components/ChinaRail";

type Photo = { src: string; alt: string };

export function ChinaGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((index) => (index === null ? index : (index + 1) % photos.length));
      if (event.key === "ArrowLeft") {
        setOpen((index) => (index === null ? index : (index - 1 + photos.length) % photos.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ChinaRail title="Галерея" arrows="sides">
        {photos.map((photo, index) => (
          <button key={photo.src} type="button" className="china-shot" onClick={() => setOpen(index)}>
            <img src={photo.src} alt={photo.alt} />
          </button>
        ))}
      </ChinaRail>
      {current && open !== null ? (
        <div className="china-lightbox" onClick={() => setOpen(null)}>
          <button type="button" className="china-lightbox-close" aria-label="Закрыть" onClick={() => setOpen(null)}>
            ×
          </button>
          <button
            type="button"
            className="china-lightbox-nav prev"
            aria-label="Предыдущее фото"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((open - 1 + photos.length) % photos.length);
            }}
          >
            ‹
          </button>
          <img src={current.src} alt={current.alt} onClick={(event) => event.stopPropagation()} />
          <button
            type="button"
            className="china-lightbox-nav next"
            aria-label="Следующее фото"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((open + 1) % photos.length);
            }}
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}
