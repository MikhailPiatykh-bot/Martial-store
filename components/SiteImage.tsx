import Image from "next/image";
import type { MouseEvent } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  eager?: boolean;
  draggable?: boolean;
  onClick?: (event: MouseEvent<HTMLImageElement>) => void;
};

// Local files go through the optimizer. A query on the path is only a cache
// buster and would make /_next/image miss the file.
export function SiteImage({ src, alt, width, height, sizes, className, priority, eager, draggable, onClick }: Props) {
  if (!src.startsWith("/")) {
    return <img src={src} alt={alt} width={width} height={height} className={className} draggable={draggable} onClick={onClick} />;
  }
  const local = src.split("?")[0];
  if (priority) {
    return (
      <Image
        src={local}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        draggable={draggable}
        onClick={onClick}
        priority
        fetchPriority="high"
      />
    );
  }
  return (
    <Image
      src={local}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      draggable={draggable}
      onClick={onClick}
      loading={eager ? "eager" : "lazy"}
    />
  );
}
