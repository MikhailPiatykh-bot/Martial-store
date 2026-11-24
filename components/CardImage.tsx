"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SIZES = "(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 300px";

function CardPhoto({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const frame = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = frame.current?.querySelector("img");
    if (!img) return;
    const fail = () => setFailed(true);
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
    return () => img.removeEventListener("error", fail);
  }, []);

  if (failed) return <span className="ph" />;

  return (
    <span className="card-photo" ref={frame}>
      <Image
        src={src}
        alt={alt}
        width={828}
        height={828}
        sizes={SIZES}
        decoding="async"
        {...(priority ? { priority: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
      />
    </span>
  );
}

export function CardImage({
  src,
  alt = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
}) {
  if (!src) return <span className="ph" />;
  return <CardPhoto key={src} src={src} alt={alt} priority={priority} />;
}
